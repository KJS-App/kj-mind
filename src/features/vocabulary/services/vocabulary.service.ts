import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../../firebase/firebase.service';
import {
  VocabularyItemDeleteDto,
  VocabularyItemDto,
} from '../types/vocabulary.types';
import * as admin from 'firebase-admin';

@Injectable()
export class VocabularyService {
  private readonly logger = new Logger(VocabularyService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async createCategory(
    categoryName: string,
  ): Promise<{ success: boolean; message: string; categoryName: string }> {
    try {
      const firestore = this.firebaseService.getFirestore();

      const categoryDocRef = firestore
        .collection('vocabulary')
        .doc(categoryName);

      const categoryDoc = await categoryDocRef.get();

      if (categoryDoc.exists) {
        return {
          success: false,
          message: 'Category already exists',
          categoryName,
        };
      }

      await categoryDocRef.set({
        categoryName: categoryName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await categoryDocRef.collection('items').doc('_metadata').set({
        itemCount: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      this.logger.log(`Category '${categoryName}' created successfully`);

      return {
        success: true,
        message: 'Category created successfully',
        categoryName,
      };
    } catch (error) {
      this.logger.error('Error creating category:', error);
      throw error;
    }
  }

  async addVocabularyItem(
    vocabularyItem: VocabularyItemDto,
  ): Promise<{ success: boolean; id: string; message: string }> {
    try {
      if (!vocabularyItem.category) {
        throw new Error('Category is required');
      }

      const firestore = this.firebaseService.getFirestore();

      const categoryDocRef = firestore
        .collection('vocabulary')
        .doc(vocabularyItem.category);

      const categoryDoc = await categoryDocRef.get();

      if (!categoryDoc.exists) {
        throw new Error(
          `Category '${vocabularyItem.category}' does not exist. Please create it first.`,
        );
      }

      const categoryCollectionRef = categoryDocRef.collection('items');

      const docRef = vocabularyItem.id
        ? categoryCollectionRef.doc(vocabularyItem.id)
        : categoryCollectionRef.doc();

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

      await categoryCollectionRef.doc('_metadata').set(
        {
          itemCount: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      this.logger.log(
        `Vocabulary item added successfully to category '${vocabularyItem.category}' with ID: ${docRef.id}`,
      );

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

  async deleteVocabularyItem(
    vocabularyItemDeleteDto: VocabularyItemDeleteDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!vocabularyItemDeleteDto.categoryName) {
        throw new Error('Category name is required for deletion');
      }

      if (!vocabularyItemDeleteDto.itemId) {
        throw new Error('Item ID is required for deletion');
      }

      if (vocabularyItemDeleteDto.itemId === '_metadata') {
        throw new Error('Cannot delete metadata document');
      }

      const firestore = this.firebaseService.getFirestore();
      const itemRef = firestore
        .collection('vocabulary')
        .doc(vocabularyItemDeleteDto.categoryName)
        .collection('items')
        .doc(vocabularyItemDeleteDto.itemId);

      const itemDoc = await itemRef.get();

      if (!itemDoc.exists) {
        return {
          success: false,
          message: 'Vocabulary item not found',
        };
      }

      await itemRef.delete();
      const metadataRef = firestore
        .collection('vocabulary')
        .doc(vocabularyItemDeleteDto.categoryName)
        .collection('items')
        .doc('_metadata');
      await metadataRef.set(
        {
          itemCount: admin.firestore.FieldValue.increment(-1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      this.logger.log(
        `Vocabulary item '${vocabularyItemDeleteDto.itemId}' deleted successfully from category '${vocabularyItemDeleteDto.categoryName}'`,
      );
      return {
        success: true,
        message: 'Vocabulary item deleted successfully',
      };
    } catch (error) {
      this.logger.error('Error deleting vocabulary item:', error);
      throw error;
    }
  }

  async updateVocabularyItem(
    vocabularyItem: VocabularyItemDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!vocabularyItem.category) {
        throw new Error('Category is required');
      } else if (!vocabularyItem.id) {
        throw new Error('Item ID is required');
      }
      const firestore = this.firebaseService.getFirestore();

      const itemRef = firestore
        .collection('vocabulary')
        .doc(vocabularyItem.category)
        .collection('items')
        .doc(vocabularyItem.id);

      const itemDoc = await itemRef.get();

      if (!itemDoc.exists) {
        throw new Error(
          `Vocabulary item with ID '${vocabularyItem.id}' does not exist in category '${vocabularyItem.category}'.`,
        );
      }

      const updatedDoc = {
        id: vocabularyItem.id,
        category: vocabularyItem.category,
        englishWord: vocabularyItem.englishWord,
        koreanWord: vocabularyItem.koreanWord,
        japaneseWord: vocabularyItem.japaneseWord,
        imageUrl: vocabularyItem.imageUrl,
        sinhalaWord: vocabularyItem.sinhalaWord,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await itemRef.set(updatedDoc);
      this.logger.log(
        `Vocabulary item with ID '${vocabularyItem.id}' updated successfully in category '${vocabularyItem.category}'`,
      );
      return {
        success: true,
        message: 'Vocabulary item updated successfully',
      };
    } catch (error) {
      this.logger.error('Error updating vocabulary item:', error);
      throw error;
    }
  }
}
