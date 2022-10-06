import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxyRankingAPI } from '../proxyrmq/client-proxy';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private clientProxyRankingAPI: ClientProxyRankingAPI,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  private clientNotifications =
    this.clientProxyRankingAPI.getClientProxyNotificationsInstance();

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    try {
      const createdChallenge = new this.challengeModel(challenge);
      createdChallenge.dateHourRequest = new Date();

      createdChallenge.status = ChallengeStatus.PENDING;
      this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)}`);

      return await createdChallenge.save();

      // return await lastValueFrom(
      //   this.clientNotifications.emit('new-challenge-notification', challenge),
      // );
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async listAllChallenges(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async listChallengesFromOnePlayer(
    _id: any,
  ): Promise<Challenge[] | Challenge> {
    try {
      return await this.challengeModel.find().where('players').in(_id).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async listChallengeById(_id: any): Promise<Challenge> {
    try {
      return await this.challengeModel.findOne({ _id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async listDoneChallenges(idCategory: string): Promise<Challenge[]> {
    try {
      return await this.challengeModel
        .find()
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.DONE)
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async listDoneChallengesByDate(
    idCategory: string,
    dataRef: string,
  ): Promise<Challenge[]> {
    try {
      const dataRefNew = `${dataRef} 23:59:59.999`;

      return await this.challengeModel
        .find()
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.DONE)
        .where('dateHourChallenge')
        // .lte(
        //   momentTimezone(dataRefNew)
        //     .tz('UTC')
        //     .format('YYYY-MM-DD HH:mm:ss.SSS+00:00'),
        // )
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallenge(_id: string, challenge: Challenge): Promise<void> {
    try {
      challenge.dateHourResponse = new Date();
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallengeMatch(
    idMatch: string,
    challenge: Challenge,
  ): Promise<void> {
    try {
      challenge.status = ChallengeStatus.DONE;
      challenge.match = idMatch;
      await this.challengeModel
        .findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteChallenge(challenge: Challenge): Promise<void> {
    try {
      const { _id } = challenge;

      challenge.status = ChallengeStatus.CANCELED;
      this.logger.log(`challenge: ${JSON.stringify(challenge)}`);
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
