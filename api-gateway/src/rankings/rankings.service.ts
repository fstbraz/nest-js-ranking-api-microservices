import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxyRankingAPI } from '../proxyrmq/client-proxy';

@Injectable()
export class RankingsService {
  constructor(private clientProxyRankingAPI: ClientProxyRankingAPI) {}

  private clientRankingsBackend =
    this.clientProxyRankingAPI.getClientProxyRankingsInstance();

  async listRankings(idCategory: string, dataRef: string): Promise<any> {
    if (!idCategory) {
      throw new BadRequestException('The category id is mandatory');
    }

    return await lastValueFrom(
      this.clientRankingsBackend.send('list-rankings', {
        idCategory,
        dataRef: dataRef ? dataRef : '',
      }),
    );
  }
}
