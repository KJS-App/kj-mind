import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PastpapersService } from './pastpapers.service';
import type { IPastPaper } from './types/pastpaper.types';
import { AdminAuthGuard } from 'src/auth/guards/admin-auth/admin-auth.guard';

@Controller('pastpapers')
export class PastpapersController {
  constructor(private readonly pastpapersService: PastpapersService) {}

  @Post('addPaper')
  @UseGuards(AdminAuthGuard)
  async addPaper(@Body() body: IPastPaper): Promise<{ message: string; paperId: string }> {
    return this.pastpapersService.addPaper(body);
  }

  @Get('getPapers')
  @UseGuards(AdminAuthGuard)
  async getPapers(
    @Query('isPastPaper') isPastPaper?: string,
    @Query('subject') subject?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    const pastPaperFilter =
      isPastPaper !== undefined ? isPastPaper === 'true' : undefined;

    return this.pastpapersService.getPapers(
      pageNum,
      limitNum,
      subject,
      pastPaperFilter,
    );
  }

  //get paper by id
  @Get('getPaperById')
  async getPaperById(
    @Query('paperId') paperId: string,
  ): Promise<IPastPaper | null> {
    return this.pastpapersService.getPaperById(paperId);
  }

  @Delete('deletePaper')
  @UseGuards(AdminAuthGuard)
  async deletePaper(@Query('paperId') paperId: string): Promise<{ message: string; paperId: string }> {
    return this.pastpapersService.deletePaper(paperId);
  }

  @Post('updatePaper')
  @UseGuards(AdminAuthGuard)
  async updatePaper(
    @Query('paperId') paperId: string,
    @Body() body: Partial<IPastPaper>,
  ): Promise<{ message: string; paperId: string }> {
    return this.pastpapersService.updatePaper(paperId, body);
  }
}
