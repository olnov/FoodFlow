import { Injectable } from '@nestjs/common';
import { Client } from './schemas/client.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async validate(clientId: string, clientSecret: string) {
    const client = await this.clientModel.findOne({ clientId }).exec();
    if (!client) return null;

    const isValid = await bcrypt.compare(clientSecret, client.clientSecret);
    return isValid ? client : null;
  }
}
