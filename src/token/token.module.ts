import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}])],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
