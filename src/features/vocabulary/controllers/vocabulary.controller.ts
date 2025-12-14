import { Controller, Get, Post, Request, UseGuards, Body } from '@nestjs/common';
import { RefreshAuthGuard } from '../../../auth/guards/refresh-auth/refresh-auth.guard';
import type { DecodedFirebaseToken } from '../../../auth/types/token-user.types';
import { AdminAuthGuard } from '../../../auth/guards/admin-auth/admin-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import type { VocabularyItemDto } from '../types/vocabulary.types';
import { VocabularyService } from '../services/vocabulary.service';

@Controller('vocabulary')
export class VocabularyController {

  constructor(private readonly vocabularyService: VocabularyService){}

  @UseGuards(AdminAuthGuard)
  @Post('add')
  async addVocabulary(
    @Body() vocabularyItem: VocabularyItemDto,
    @Request() req: { user: DecodedFirebaseToken }
  ) {
    const { user } = req;
    const result = await this.vocabularyService.addVocabularyItem(vocabularyItem, user);
    console.log('token:', user);
    return result;
  }
}
