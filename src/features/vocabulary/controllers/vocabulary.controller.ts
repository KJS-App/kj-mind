import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import type { DecodedFirebaseToken } from '../../../auth/types/token-user.types';
import { AdminAuthGuard } from '../../../auth/guards/admin-auth/admin-auth.guard';
import type { VocabularyItemDto } from '../types/vocabulary.types';
import { VocabularyService } from '../services/vocabulary.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @UseGuards(AdminAuthGuard)
  @Post('add')
  async addVocabulary(
    @Body() vocabularyItem: VocabularyItemDto,
    @Request() req: { user: DecodedFirebaseToken },
  ) {
    const { user } = req;
    const result = await this.vocabularyService.addVocabularyItem(
      vocabularyItem,
      user,
    );
    console.log('token:', user);
    return result;
  }
}
