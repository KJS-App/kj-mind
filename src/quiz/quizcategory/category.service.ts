import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import type { firestore } from 'firebase-admin';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.model';

@Injectable()
export class CategoryService implements OnModuleInit {
  private collection: firestore.CollectionReference | null = null;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit(): void {
    this.collection = this.firebaseService
      .getFirestore()
      .collection('categories');
  }

  private getCollection(): firestore.CollectionReference {
    if (!this.collection) {
      this.collection = this.firebaseService
        .getFirestore()
        .collection('categories');
    }
    return this.collection;
  }

  async findAll(): Promise<Category[]> {
    const snapshot = await this.getCollection().get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Category[];
  }

  async findOne(id: string): Promise<Category> {
    const doc = await this.getCollection().doc(id).get();
    if (!doc.exists) throw new NotFoundException('Category not found');
    return { id: doc.id, ...doc.data() } as Category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    if (!dto) throw new BadRequestException('Request body is required');

    const ref = await this.getCollection().add({
      ...dto,
    });

    const saved = await ref.get();
    return { id: saved.id, ...saved.data() } as Category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const ref = this.getCollection().doc(id);
    const exists = await ref.get();

    if (!exists.exists) throw new NotFoundException('Category not found');

    await ref.update(dto as FirebaseFirestore.UpdateData<Category>);
    const updated = await ref.get();
    return { id: updated.id, ...updated.data() } as Category;
  }

  async remove(id: string): Promise<string> {
    const ref = this.getCollection().doc(id);
    const exists = await ref.get();

    if (!exists.exists) throw new NotFoundException('Category not found');

    await ref.delete();
    return `Category ${id} deleted`;
  }
}
