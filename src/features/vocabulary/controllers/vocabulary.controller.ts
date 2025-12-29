import {
  Get,
  Controller,
  Post,
  UseGuards,
  Body,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { AdminAuthGuard } from '../../../auth/guards/admin-auth/admin-auth.guard';
import type {
  VocabularyCategoryDto,
  VocabularyItemDto,
  VocabularyItemDeleteDto,
} from '../types/vocabulary.types';
import { VocabularyService } from '../services/vocabulary.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @UseGuards(AdminAuthGuard)
  @Get('categories')
  async getCategories(): Promise<VocabularyCategoryDto[]> {
    const categories = await this.vocabularyService.getCategories();
    return categories;
  }

  @UseGuards(AdminAuthGuard)
  @Get('items')
  async getVocabularyItems(@Query('categoryName') categoryName: string) {
    const result =
      await this.vocabularyService.getVocabularyItems(categoryName);
    return result;
  }

  @UseGuards(AdminAuthGuard)
  @Post('create-category')
  async createCategory(@Query('categoryName') categoryName: string) {
    const result = await this.vocabularyService.createCategory(categoryName);
    return result;
  }

  @UseGuards(AdminAuthGuard)
  @Post('add')
  async addVocabularyItem(@Body() vocabularyItem: VocabularyItemDto) {
    const result =
      await this.vocabularyService.addVocabularyItem(vocabularyItem);
    return result;
  }

  @UseGuards(AdminAuthGuard)
  @Delete('delete')
  async deleteVocabularyItem(
    @Body() vocabularyItemDeleteDto: VocabularyItemDeleteDto,
  ) {
    const result = await this.vocabularyService.deleteVocabularyItem(
      vocabularyItemDeleteDto,
    );
    return result;
  }

  @UseGuards(AdminAuthGuard)
  @Patch('update')
  async updateVocabularyItem(@Body() vocabularyItem: VocabularyItemDto) {
    const result =
      await this.vocabularyService.updateVocabularyItem(vocabularyItem);
    return result;
  }
}
