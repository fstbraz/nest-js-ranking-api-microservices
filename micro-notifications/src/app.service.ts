import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Challenge } from './interfaces/challenge.interface';
import { Player } from './interfaces/player.interface';
import { ClientProxyRankingAPI } from './proxyrmq/client-proxy';
import HTML_NOTIFICATION_CHALLENGED from './static/html-notification-challenged';

@Injectable()
export class AppService {
  constructor(
    private clientProxyRankingAPI: ClientProxyRankingAPI,
    private readonly mailerService: MailerService,
  ) {}

  private readonly logger = new Logger(AppService.name);

  private clientAdminBackend =
    this.clientProxyRankingAPI.getClientProxyAdminBackendInstance();

  async sendMailToChallenged(challenge: Challenge): Promise<void> {
    try {
      let idChallenged = '';

      challenge.players.map((player) => {
        if (player != challenge.solicitator) {
          idChallenged = player;
        }
      });

      const challenged: Player = await lastValueFrom(
        this.clientAdminBackend.send('list-players', idChallenged),
      );

      const solicitator: Player = await lastValueFrom(
        this.clientAdminBackend.send('list-players', challenge.solicitator),
      );

      let markup = '';

      markup = HTML_NOTIFICATION_CHALLENGED;
      markup = markup.replace(/#CHALLENGED_NAME/g, challenged.name);
      markup = markup.replace(/#SOLICITATOR_NAME/g, solicitator.name);

      this.mailerService
        .sendMail({
          to: challenged.email,
          from: `"Ranking Test" <fst.braz@gmail.com>`,
          subject: 'Challenge Notification',
          html: markup,
        })
        .then((success) => {
          this.logger.log(success);
        })
        .catch((err) => {
          this.logger.log(err);
        });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      throw new RpcException(error.message);
    }
  }
}
