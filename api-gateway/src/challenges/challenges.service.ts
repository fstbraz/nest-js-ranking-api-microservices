import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxyRankingAPI } from '../proxyrmq/client-proxy';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';
import { Match } from './interfaces/match.interface';

import { Player } from 'src/players/interfaces/player.interface';
import { AssignChallengeToMatchDto } from './dtos/assign-challenge-to-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private clientProxyRankingAPI: ClientProxyRankingAPI) {}

  private readonly logger = new Logger(ChallengesService.name);

  private clientChallenges =
    this.clientProxyRankingAPI.getClientProxyChallengesInstance();

  private clientAdminBackend =
    this.clientProxyRankingAPI.getClientProxyAdminBackendInstance();

  async createChallenge(createChallengeDto: CreateChallengeDto) {
    this.logger.log(
      `createChallengeDto: ${JSON.stringify(createChallengeDto)}`,
    );

    const players: Player[] = await lastValueFrom(
      this.clientAdminBackend.send('list-players', ''),
    );

    createChallengeDto.players.map((playerDto) => {
      const playerFilter: Player[] = players.filter(
        (jogador) => jogador._id == playerDto._id,
      );

      this.logger.log(`playerFilter: ${JSON.stringify(playerFilter)}`);

      if (playerFilter.length == 0) {
        throw new BadRequestException(
          `The id ${playerDto._id} is not from a player!`,
        );
      }

      if (playerFilter[0].category != createChallengeDto.category) {
        throw new BadRequestException(
          `The player ${playerFilter[0]._id} is not part of that category`,
        );
      }
    });

    const solicitatorIsMatchPlayer: Player[] =
      createChallengeDto.players.filter(
        (player) => player._id == createChallengeDto.solicitator,
      );

    this.logger.log(
      `solicitatorIsMatchPlayer: ${JSON.stringify(solicitatorIsMatchPlayer)}`,
    );

    if (solicitatorIsMatchPlayer.length == 0) {
      throw new BadRequestException(
        `The solicitator should be player from the match!`,
      );
    }

    const category = await lastValueFrom(
      this.clientAdminBackend.send(
        'list-categories',
        createChallengeDto.category,
      ),
    );

    this.logger.log(`category: ${JSON.stringify(category)}`);

    if (!category) {
      throw new BadRequestException(`The given category doesn't exist!`);
    }

    await this.clientChallenges.emit('create-challenge', createChallengeDto);
  }

  async listAllChallenges(idPlayer: string): Promise<any> {
    if (idPlayer) {
      const player: Player = await lastValueFrom(
        this.clientAdminBackend.send('list-players', idPlayer),
      );

      this.logger.log(`player: ${JSON.stringify(player)}`);

      if (!player) {
        throw new BadRequestException(`Player not registered!`);
      }
    }

    return lastValueFrom(
      this.clientChallenges.send('list-challenges', {
        idPlayer: idPlayer,
        _id: '',
      }),
    );
  }

  async updateChallenge(updateChallengeDto: UpdateChallengeDto, _id: string) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('list-challenges', { idPlayer: '', _id: _id }),
    );

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    if (!challenge) {
      throw new BadRequestException(`Challenge not registered!`);
    }

    if (challenge.status != ChallengeStatus.PENDING) {
      throw new BadRequestException('Only pending challenges can be updated');
    }

    await this.clientChallenges.emit('update-challenge', {
      id: _id,
      challenge: updateChallengeDto,
    });
  }

  async assignChallengeToMatch(
    assignChallengeToMatchDto: AssignChallengeToMatchDto,
    _id: string,
  ) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('list-challenges', { idPlayer: '', _id: _id }),
    );

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    if (!challenge) {
      throw new BadRequestException(`Not registered challenge!`);
    }

    if (challenge.status == ChallengeStatus.DONE) {
      throw new BadRequestException(`Challenge already done!`);
    }

    if (challenge.status != ChallengeStatus.ACCEPTED) {
      throw new BadRequestException(
        `Matches can only be assigned in accepted challenges`,
      );
    }

    if (!challenge.players.includes(assignChallengeToMatchDto.def)) {
      throw new BadRequestException(
        `The winner player should be part of the challenge!`,
      );
    }

    const match: Match = {
      category: challenge.category,
      challenge: _id,
      players: challenge.players,
      def: assignChallengeToMatchDto.def,
      result: assignChallengeToMatchDto.result,
    };

    await this.clientChallenges.emit('create-match', match);
  }

  async deleteChallenge(_id: string) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('list-challenges', { idPlayer: '', _id: _id }),
    );

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    if (!challenge) {
      throw new BadRequestException(`Challenge not registered !`);
    }

    await this.clientChallenges.emit('delete-challenge', challenge);
  }
}
