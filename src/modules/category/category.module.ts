import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, FirebaseService],
  exports: [CategoryService],
})
export class CategoryModule {}
