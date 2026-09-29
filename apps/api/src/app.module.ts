import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [AuthModule, CarsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
