import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  exports: [SubcategoryService],
})
export class SubcategoryModule {}
