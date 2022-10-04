import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ClientProxyRankingAPI } from '../proxyrmq/client-proxy';
import { Category } from './interfaces/category.interface';
import { Challenge } from './interfaces/challenge.interface';
import { EventName } from './interfaces/event-name.enum';
import { Match } from './interfaces/match.interface';
import {
  History,
  RankingResponse,
} from './interfaces/ranking-response.interface';
import { Ranking } from './interfaces/ranking.schema';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
    private clientProxyRankingAPI: ClientProxyRankingAPI,
  ) {}

  private readonly logger = new Logger(RankingsService.name);

  private clientAdminBackend =
    this.clientProxyRankingAPI.getClientProxyAdminBackendInstance();

  private clientChallenges =
    this.clientProxyRankingAPI.getClientProxyChallengesInstance();

  async processMatch(idMatch: string, match: Match): Promise<void> {
    try {
      const category: Category = await lastValueFrom(
        this.clientAdminBackend.send('list-categories', match.category),
      );

      await Promise.all(
        match.players.map(async (player) => {
          const ranking = new this.rankingModel();

          ranking.category = match.category;
          ranking.challenge = match.challenge;
          ranking.match = idMatch;
          ranking.player = player;

          if (player == match.def) {
            const eventFilter = category.events.filter(
              (event) => event.name == EventName.VICTORY,
            );

            ranking.event = EventName.VICTORY;
            ranking.operation = eventFilter[0].operation;
            ranking.points = eventFilter[0].value;
          } else {
            const eventFilter = category.events.filter(
              (event) => event.name == EventName.DEFEAT,
            );

            ranking.event = EventName.DEFEAT;
            ranking.operation = eventFilter[0].operation;
            ranking.points = eventFilter[0].value;
          }

          this.logger.log(`ranking: ${JSON.stringify(ranking)}`);

          await ranking.save();
        }),
      );
    } catch (error) {
      this.logger.error(`error: ${error}`);
      throw new RpcException(error.message);
    }
  }

  async listRankings(
    idCategory: any,
    dataRef: string,
  ): Promise<RankingResponse[] | RankingResponse> {
    try {
      this.logger.log(`idCategory: ${idCategory} dataRef: ${dataRef}`);

      const rankingRegistries = await this.rankingModel
        .find()
        .where('category')
        .equals(idCategory)
        .exec();

      const challenges: Challenge[] = await lastValueFrom(
        this.clientChallenges.send('list-done-challenges', {
          idCategory,
          dataRef,
        }),
      );

      _.remove(rankingRegistries, function (item) {
        return (
          challenges.filter((challenge) => challenge._id == item.challenge)
            .length == 0
        );
      });

      this.logger.log(
        `rankingRegistries: ${JSON.stringify(rankingRegistries)}`,
      );

      const result = _(rankingRegistries)
        .groupBy('player')
        .map((items, key) => ({
          player: key,
          history: _.countBy(items, 'event'),
          points: _.sumBy(items, 'points'),
        }))
        .value();

      const orderedResult = _.orderBy(result, 'points', 'desc');

      this.logger.log(`orderedResult: ${JSON.stringify(orderedResult)}`);

      const rankingResponseList: RankingResponse[] = [];

      orderedResult.map(function (item, index) {
        const rankingResponse: RankingResponse = {};

        rankingResponse.player = item.player;
        rankingResponse.position = index + 1;
        rankingResponse.points = item.points;

        const history: History = {};

        history.winnings = item.history.VICTORY ? item.history.VICTORY : 0;
        history.defeats = item.history.DEFEAT ? item.history.DEFEAT : 0;
        rankingResponse.matchHistory = history;

        rankingResponseList.push(rankingResponse);
      });

      return rankingResponseList;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
