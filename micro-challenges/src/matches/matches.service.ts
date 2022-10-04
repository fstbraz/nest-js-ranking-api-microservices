import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ClientProxyRankingAPI } from '../proxyrmq/client-proxy';
import { Challenge } from './../challenges/interfaces/challenge.interface';
import { Match } from './interfaces/match.interface';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientProxyRankingAPI: ClientProxyRankingAPI,
  ) {}

  private readonly logger = new Logger(MatchesService.name);

  private clientChallenges =
    this.clientProxyRankingAPI.getClientProxyChallengesInstance();

  private clientRankings =
    this.clientProxyRankingAPI.getClientProxyRankingsInstance();

  async createMatch(match: Match): Promise<Match> {
    
    try {

                Iremos persistir a match e logo em seguida atualizaremos o
                challenge. O challenge irá receber o ID da match e seu status
                será modificado para REALIZADO.
            */
      const createdMatch = new this.matchModel(match);
      this.logger.log(`createdMatch: ${JSON.stringify(createdMatch)}`);
     
      const result = await createdMatch.save();
      this.logger.log(`result: ${JSON.stringify(result)}`);
      const idMatch = result._id;
 
      const challenge: Challenge = await lastValueFrom(this.clientChallenges
        .send('list-challenges', { idJogador: '', _id: match.challenge }))
    
      await lastValueFrom(this.clientChallenges
        .emit('update-challenge-match', {
          idMatch,
          challenge: challenge,
        }))

      return await lastValueFrom(this.clientRankings
        .emit('process-match', { idMatch, match: match }))

    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
