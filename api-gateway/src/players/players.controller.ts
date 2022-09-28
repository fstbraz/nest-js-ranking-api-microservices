import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { ParametersValidationPipe } from '../common/pipes/parameters-validation.pipe';
import { ClientProxyRankingAPI } from '../proxyrmq/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(private clientProxyRankingAPI: ClientProxyRankingAPI) {}

  private clientAdminBackend =
    this.clientProxyRankingAPI.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);

    const category = await lastValueFrom(
      this.clientAdminBackend.send('list-categories', createPlayerDto.category),
    );

    if (category) {
      await this.clientAdminBackend.emit('create-player', createPlayerDto);
    } else {
      throw new BadRequestException(`The category doesn't exist!`);
    }
  }

  @Get()
  listPlayers(@Query('idPlayer') _id: string): Observable<any> {
    return this.clientAdminBackend.send('list-players', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ParametersValidationPipe) _id: string,
  ) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send('list-categories', updatePlayerDto.category),
    );

    if (category) {
      await this.clientAdminBackend.emit('update-player', {
        id: _id,
        player: updatePlayerDto,
      });
    } else {
      throw new BadRequestException(`The category doesn't exist!`);
    }
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ParametersValidationPipe) _id: string) {
    await this.clientAdminBackend.emit('delete-player', { _id });
  }
}
