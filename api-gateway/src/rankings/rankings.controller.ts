import { Controller, Get, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';
@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private rankingsService: RankingsService) {}
  @Get()
  async consultarRankings(
    @Query('idCategory') idCategory: string,
    @Query('dataRef') dataRef: string,
  ) {
    return await this.rankingsService.listRankings(idCategory, dataRef);
  }
}
