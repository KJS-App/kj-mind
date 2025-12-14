import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../../firebase/firebase.service';
import { VocabularyItemDto } from '../types/vocabulary.types';
import { DecodedFirebaseToken } from '../../../auth/types/token-user.types';
import * as admin from 'firebase-admin';

@Injectable()
export class VocabularyService {
  private readonly logger = new Logger(VocabularyService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async addVocabularyItem(
    vocabularyItem: VocabularyItemDto,
    user: DecodedFirebaseToken,
  ): Promise<{ success: boolean; id: string; message: string }> {
    try {
      this.logger.log(`Adding vocabulary item by user: ${user.uid}`);

      // Get Firestore instance
      const firestore = this.firebaseService.getFirestore();
      
      // Generate a new ID if not provided
      const vocabularyRef = firestore.collection('vocabulary');
      const docRef = vocabularyItem.id
        ? vocabularyRef.doc(vocabularyItem.id)
        : vocabularyRef.doc();

      const vocabularyData = {
        id: docRef.id,
        category: vocabularyItem.category,
        englishWord: vocabularyItem.englishWord,
        koreanWord: vocabularyItem.koreanWord,
        japaneseWord: vocabularyItem.japaneseWord,
        imageUrl: vocabularyItem.imageUrl,
        sinhalaWord: vocabularyItem.sinhalaWord,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await docRef.set(vocabularyData);

      this.logger.log(`Vocabulary item added successfully with ID: ${docRef.id}`);

      return {
        success: true,
        id: docRef.id,
        message: 'Vocabulary item added successfully',
      };
    } catch (error) {
      this.logger.error('Error adding vocabulary item:', error);
      throw error;
    }
  }
}
