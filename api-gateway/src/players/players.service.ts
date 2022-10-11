import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AwsS3Service } from '../aws/aws-s3.service';
import { ClientProxyRankingAPI } from '../proxyrmq/client-proxy';
import { Category } from './../categories/interfaces/category';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private logger = new Logger(PlayersService.name);

  constructor(
    private clientProxyRankingAPI: ClientProxyRankingAPI,
    private awsS3Service: AwsS3Service,
  ) {}

  private clientAdminBackend =
    this.clientProxyRankingAPI.getClientProxyAdminBackendInstance();

  async createPlayer(createPlayerDto: CreatePlayerDto) {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);

    const category: Category = await lastValueFrom(
      this.clientAdminBackend.send('list-categories', createPlayerDto.category),
    );

    if (category) {
      await this.clientAdminBackend.emit('create-player', createPlayerDto);
    } else {
      throw new BadRequestException(`Category not registered!`);
    }
  }

  async uploadFile(file, _id: string): Promise<any> {
    const player: Player = await lastValueFrom(
      this.clientAdminBackend.send('list-players', _id),
    );

    if (!player) {
      throw new BadRequestException(`Player not found!`);
    }

    const urlFotoJogador: { url: string } = await this.awsS3Service.uploadFile(
      file,
      _id,
    );

    const updatePlayerDto: UpdatePlayerDto = {};
    updatePlayerDto.playerPhotoUrl = urlFotoJogador.url;

    await this.clientAdminBackend.emit('update-player', {
      id: _id,
      player: updatePlayerDto,
    });

    return await lastValueFrom(
      this.clientAdminBackend.send('list-players', _id),
    );
  }

  async listPlayers(_id: string): Promise<any> {
    return await lastValueFrom(
      this.clientAdminBackend.send('list-players', _id ? _id : ''),
    );
  }

  async updatePlayer(updatePlayerDto: UpdatePlayerDto, _id: string) {
    const category: Category = await lastValueFrom(
      this.clientAdminBackend.send('list-categories', updatePlayerDto.category),
    );

    if (category) {
      await this.clientAdminBackend.emit('update-player', {
        id: _id,
        player: updatePlayerDto,
      });
    } else {
      throw new BadRequestException(`Category not registered!`);
    }
  }

  deletePlayer(_id: string) {
    this.clientAdminBackend.emit('delete-player', { _id });
  }
}
