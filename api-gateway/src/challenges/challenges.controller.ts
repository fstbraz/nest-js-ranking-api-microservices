import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AssignChallengeToMatchDto } from './dtos/assign-challenge-to-match.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenges-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async listAllChallenges(
    @Query('idPlayer') _id: string,
  ): Promise<Array<Challenge>> {
    return await this.challengesService.listAllChallenges(_id);
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    await this.challengesService.updateChallenge(updateChallengeDto, _id);
  }

  @Post('/:challenge/match/')
  async assignChallengeToMatch(
    @Body(ValidationPipe) assignChallengeToMatchDto: AssignChallengeToMatchDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.assignChallengeToMatch(
      assignChallengeToMatchDto,
      _id,
    );
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.deleteChallenge(_id);
  }
}
