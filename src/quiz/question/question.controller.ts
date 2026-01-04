import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // Create question directly inside a sub-category
  @Post(':subCategoryId')
  create(
    @Param('subCategoryId') subCategoryId: string,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.questionService.create(subCategoryId, dto);
  }

  // Get all questions inside a sub-category
  @Get(':subCategoryId')
  findAll(@Param('subCategoryId') subCategoryId: string) {
    return this.questionService.findAll(subCategoryId);
  }

  // Get single question
  @Get(':subCategoryId/:questionId')
  findOne(
    @Param('subCategoryId') subCategoryId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.questionService.findOne(subCategoryId, questionId);
  }

  // Update question
  @Patch(':subCategoryId/:questionId')
  update(
    @Param('subCategoryId') subCategoryId: string,
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.update(subCategoryId, questionId, dto);
  }

  // Delete question
  @Delete(':subCategoryId/:questionId')
  remove(
    @Param('subCategoryId') subCategoryId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.questionService.remove(subCategoryId, questionId);
  }
}
