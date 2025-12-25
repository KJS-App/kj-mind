import { Controller, Post, Request, UseGuards, Body, Delete } from '@nestjs/common';
import type { DecodedFirebaseToken } from '../../../auth/types/token-user.types';
import { AdminAuthGuard } from '../../../auth/guards/admin-auth/admin-auth.guard';
import type { VocabularyItemDeleteDto, VocabularyItemDto } from '../types/vocabulary.types';
import { VocabularyService } from '../services/vocabulary.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @UseGuards(AdminAuthGuard)
  @Post('create-category')
  async createCategory(
    @Body() body: { categoryName: string },
  ) {
    const result = await this.vocabularyService.createCategory(
      body.categoryName,
    );
    return result;
  }

  @UseGuards(AdminAuthGuard)
  @Post('add')
  async addVocabularyItem(
    @Body() vocabularyItem: VocabularyItemDto,
  ) {
    const result = await this.vocabularyService.addVocabularyItem(
      vocabularyItem,
    );
    return result;
  }

  // @UseGuards(AdminAuthGuard)
  @Delete('delete')
  async deleteVocabularyItem(
    @Body() vocabularyItemDeleteDto: VocabularyItemDeleteDto,
  ) {
    const result = await this.vocabularyService.deleteVocabularyItem(
      vocabularyItemDeleteDto,
    );
    return result;
  }
}
