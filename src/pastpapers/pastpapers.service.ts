import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { IPastPaper, PaginatedResponse } from './types/pastpaper.types';

@Injectable()
export class PastpapersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async addPaper(data: IPastPaper): Promise<string> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const pastpapersCollection = firestore.collection('pastpapers');
      const docRef = await pastpapersCollection.add(data);
      return `Past paper added with ID: ${docRef.id}`;
    } catch (error) {
      console.log('Data received for new past paper:', data);
      console.error('Error adding past paper:', error);
      throw new Error('Failed to add past paper');
    }
  }
  async getPapers(
    page = 1,
    limit = 10,
    language?: string,
    isPastPaper?: boolean,
  ): Promise<PaginatedResponse<IPastPaper>> {
    const firestore = this.firebaseService.getFirestore();
    const collectionRef = firestore.collection('pastpapers');

    let query: FirebaseFirestore.Query = collectionRef;

    if (language) {
      query = query.where('language', '==', language);
    }

    if (typeof isPastPaper === 'boolean') {
      query = query.where('isPastPaper', '==', isPastPaper);
    }

    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    const offset = (page - 1) * limit;

    const snapshot = await query.offset(offset).limit(limit).get();

    const papers = snapshot.docs.map((doc) => ({
      paperId: doc.id,
      ...(doc.data() as IPastPaper),
    }));

    return {
      data: papers,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  //get a paper by id
  async getPaperById(paperId: string): Promise<IPastPaper | null> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const pastpapersCollection = firestore.collection('pastpapers');
      const doc = await pastpapersCollection.doc(paperId).get();
      if (!doc.exists) {
        return null;
      }
      return doc.data() as IPastPaper;
    } catch (error) {
      console.error('Error getting past paper by ID:', error);
      throw new Error('Failed to get past paper by ID');
    }
  }

  async deletePaper(paperId: string): Promise<string> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const pastpapersCollection = firestore.collection('pastpapers');
      await pastpapersCollection.doc(paperId).delete();
      return `Past paper with ID: ${paperId} deleted successfully.`;
    } catch (error) {
      console.error('Error deleting past paper:', error);
      throw new Error('Failed to delete past paper');
    }
  }

  async updatePaper(
    paperId: string,
    data: Partial<IPastPaper>,
  ): Promise<string> {
    try {
      const firestore = this.firebaseService.getFirestore();
      const pastpapersCollection = firestore.collection('pastpapers');
      await pastpapersCollection.doc(paperId).update(data);
      return `Past paper with ID: ${paperId} updated successfully.`;
    } catch (error) {
      console.error('Error updating past paper:', error);
      throw new Error('Failed to update past paper');
    }
  }
}
