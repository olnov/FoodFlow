import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schemas/refresh-token.schema';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async create(userId: string, token: string, expiresIn: number) {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    return this.refreshTokenModel.create({ userId, token, expiresAt });
  }

  async findByToken(token: string) {
    return this.refreshTokenModel.findOne({ token });
  }

  async remove(token: string) {
    return this.refreshTokenModel.deleteOne({ token });
  }

  async removeAllForUser(userId: string) {
    return this.refreshTokenModel.deleteMany({ userId });
  }
}
