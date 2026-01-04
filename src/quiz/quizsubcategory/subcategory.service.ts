import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import type { firestore as FirestoreNS } from 'firebase-admin';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './subcategory.model';

@Injectable()
export class SubcategoryService implements OnModuleInit {
  private collection: FirestoreNS.CollectionReference | null = null;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit(): void {
    this.collection = this.firebaseService
      .getFirestore()
      .collection('subcategories');
  }

  private getCollection(): FirestoreNS.CollectionReference {
    if (!this.collection) {
      this.collection = this.firebaseService
        .getFirestore()
        .collection('subcategories');
    }
    return this.collection;
  }

  async findAll(): Promise<Subcategory[]> {
    const snapshot = await this.getCollection().get();
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Subcategory[];
  }

  async findByCategory(categoryId: string): Promise<Subcategory[]> {
    const snapshot = await this.getCollection()
      .where('categoryId', '==', categoryId)
      .get();
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Subcategory[];
  }

  async findOne(id: string): Promise<Subcategory> {
    const doc = await this.getCollection().doc(id).get();
    if (!doc.exists) throw new NotFoundException('Subcategory not found');
    return { id: doc.id, ...doc.data() } as Subcategory;
  }

  async create(dto: CreateSubcategoryDto): Promise<Subcategory> {
    const ref = await this.getCollection().add({
      ...dto,
    });
    const saved = await ref.get();
    return { id: saved.id, ...saved.data() } as Subcategory;
  }

  async update(id: string, dto: UpdateSubcategoryDto): Promise<Subcategory> {
    const ref = this.getCollection().doc(id);
    const doc = await ref.get();

    if (!doc.exists) throw new NotFoundException('Subcategory not found');

    await ref.set({ ...dto }, { merge: true });

    const updated = await ref.get();
    return { id: updated.id, ...updated.data() } as Subcategory;
  }

  async remove(id: string): Promise<string> {
    const ref = this.getCollection().doc(id);
    const doc = await ref.get();

    if (!doc.exists) throw new NotFoundException('Subcategory not found');

    await ref.delete();

    return `Subcategory ${id} deleted`;
  }
}
