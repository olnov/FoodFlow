import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [RefreshTokenService],
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
