import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token, tokenDokument } from './schemas/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TokenService {

  constructor(@InjectModel(Token.name) private tokenModel: Model<tokenDokument>){}
  async create(createTokenDto: CreateTokenDto) {

    const createToken = await this.tokenModel.create(createTokenDto)
    return createToken;
  }

  findAll() {
    return `This action returns all token`;
  }

  async findOne(user_id: string) {
    
    const oneToken = await this.tokenModel.findOne({user_id})
    return oneToken;
  }

  async update(id: string, updateTokenDto: UpdateTokenDto) {
    const updatedToken = await this.tokenModel.findByIdAndUpdate(id, updateTokenDto)
    return updatedToken
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
// function injectModel(name: string): (target: typeof TokenService, propertyKey: undefined, parameterIndex: 0) => void {
//   throw new Error('Function not implemented.');
// }

