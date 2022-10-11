import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ParametersValidationPipe } from '../common/pipes/parameters-validation.pipe';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(private playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);

    await this.playersService.createPlayer(createPlayerDto);
  }

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('_id') _id: string) {
    return await this.playersService.uploadFile(file, _id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async listPlayers(@Req() req: Request, @Query('idPlayer') _id: string) {
    this.logger.log(`req: ${JSON.stringify(req.user)}`);
    return await this.playersService.listPlayers(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ParametersValidationPipe) _id: string,
  ) {
    return await this.playersService.updatePlayer(updatePlayerDto, _id);
  }

  @Delete('/:_id')
  async deletePlayer(@Param('_id', ParametersValidationPipe) _id: string) {
    this.playersService.deletePlayer(_id);
  }
}
