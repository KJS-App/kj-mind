import { Module } from '@nestjs/common';
import { PastpapersService } from './pastpapers.service';
import { PastpapersController } from './pastpapers.controller';

@Module({
  controllers: [PastpapersController],
  providers: [PastpapersService],
})
export class PastpapersModule {}
