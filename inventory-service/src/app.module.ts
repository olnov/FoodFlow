import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'node:process';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { InventoryModule } from './inventory/inventory.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.INV_DB_URI || 'mongodb://localhost:27017/inventory_service',
    ),
    InventoryModule,
  ],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
