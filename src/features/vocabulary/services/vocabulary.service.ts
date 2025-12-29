import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../../../firebase/firebase.service';
import {
  VocabularyCategoryDto,
  VocabularyItemDeleteDto,
  VocabularyItemDto,
} from '../types/vocabulary.types';
import * as admin from 'firebase-admin';

@Injectable()
export class VocabularyService {
  private readonly logger = new Logger(VocabularyService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async getCategories(): Promise<VocabularyCategoryDto[]> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const categoriesSnapshot = await firestore.collection('vocabulary').get();
      const categories: VocabularyCategoryDto[] = [];

      categoriesSnapshot.forEach((doc) => {
        const data = doc.data() as {
          categoryName: string;
          createdAt: admin.firestore.Timestamp;
          updatedAt: admin.firestore.Timestamp;
        };
        categories.push({
          categoryId: doc.id,
          categoryName: data.categoryName,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        });
      });
      return categories;
    } catch (error) {
      this.logger.error('Error getting categories:', error);
      throw error;
    }
  }
  async createCategory(
    categoryName: string,
  ): Promise<{ success: boolean; message: string; categoryName: string }> {
    try {
      const firestore = this.firebaseService.getFirestore();

      const existingCategory = await firestore
        .collection('vocabulary')
        .where('categoryName', '==', categoryName)
        .limit(1)
        .get();

      if (!existingCategory.empty) {
        return {
          success: false,
          message: 'Category already exists',
          categoryName,
        };
      }

      const categoryDocRef = firestore.collection('vocabulary').doc();

      await categoryDocRef.set({
        categoryName,
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

      // Find category by categoryName
      const categoryQuery = await firestore
        .collection('vocabulary')
        .where('categoryName', '==', vocabularyItem.category)
        .limit(1)
        .get();

      if (categoryQuery.empty) {
        throw new Error(
          `Category '${vocabularyItem.category}' does not exist. Please create it first.`,
        );
      }

      const categoryDoc = categoryQuery.docs[0];
      const categoryDocRef = categoryDoc.ref;

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

      const categoryQuery = await firestore
        .collection('vocabulary')
        .where('categoryName', '==', vocabularyItemDeleteDto.categoryName)
        .limit(1)
        .get();

      if (categoryQuery.empty) {
        throw new Error(
          `Category '${vocabularyItemDeleteDto.categoryName}' does not exist.`,
        );
      }

      const categoryDoc = categoryQuery.docs[0];
      const itemRef = categoryDoc.ref
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
      const metadataRef = categoryDoc.ref.collection('items').doc('_metadata');
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

      // Find category by categoryName
      const categoryQuery = await firestore
        .collection('vocabulary')
        .where('categoryName', '==', vocabularyItem.category)
        .limit(1)
        .get();

      if (categoryQuery.empty) {
        throw new Error(
          `Category '${vocabularyItem.category}' does not exist.`,
        );
      }

      const categoryDoc = categoryQuery.docs[0];
      const itemRef = categoryDoc.ref
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


  async getVocabularyItems(categoryName: string): Promise<VocabularyItemDto[]> {
  try {
    if (!categoryName) {
      throw new Error('Category name is required');
    }

    const firestore = this.firebaseService.getFirestore();

    const categoryQuery = await firestore
      .collection('vocabulary')
      .where('categoryName', '==', categoryName)
      .limit(1)
      .get();

    if (categoryQuery.empty) {
      throw new Error(`Category '${categoryName}' does not exist.`);
    }

    const categoryDoc = categoryQuery.docs[0];
    const itemsSnapshot = await categoryDoc.ref
      .collection('items')
      .where(admin.firestore.FieldPath.documentId(), '!=', '_metadata')
      .get();

    const items: VocabularyItemDto[] = [];
    itemsSnapshot.forEach((doc) => {
      const data = doc.data() as VocabularyItemDto;
      items.push({
        ...data,
        id: doc.id,
      });
    });

    return items;
  } catch (error) {
    this.logger.error('Error getting vocabulary items:', error);
    throw error;
  }
}
}
