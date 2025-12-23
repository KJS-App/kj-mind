import { Injectable, NotFoundException } from '@nestjs/common';
import type { firestore } from 'firebase-admin';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly firebaseService: FirebaseService) {}

  private questionCollection(subCategoryId: string) {
    return this.firebaseService
      .getFirestore()
      .collection('subcategories')
      .doc(subCategoryId)
      .collection('questions');
  }

  async create(subCategoryId: string, dto: CreateQuestionDto) {
    const ref = await this.questionCollection(subCategoryId).add({
      ...dto,
      createdAt: new Date(),
    });

    return { id: ref.id, ...dto };
  }

  async findAll(subCategoryId: string) {
    const snap = await this.questionCollection(subCategoryId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async findOne(subCategoryId: string, questionId: string) {
    const doc = await this.questionCollection(subCategoryId)
      .doc(questionId)
      .get();

    if (!doc.exists) throw new NotFoundException('Question not found');

    return { id: doc.id, ...doc.data() };
  }

  async update(
    subCategoryId: string,
    questionId: string,
    dto: UpdateQuestionDto,
  ) {
    const payload = dto as firestore.UpdateData<firestore.DocumentData>;
    await this.questionCollection(subCategoryId)
      .doc(questionId)
      .update(payload);
    return { message: 'Question updated successfully' };
  }

  async remove(subCategoryId: string, questionId: string) {
    await this.questionCollection(subCategoryId)
      .doc(questionId)
      .delete();
    return { message: 'Question deleted successfully' };
  }
}
