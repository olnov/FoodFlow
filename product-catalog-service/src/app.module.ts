import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'node:process';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CatalogModule } from './catalog/catalog.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://localhost:27017/product_catalog_service',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CatalogModule,
  ],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
