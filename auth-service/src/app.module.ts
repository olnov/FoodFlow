import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_service',
    ),
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RefreshTokenModule,
  ],
})
export class AppModule {}
