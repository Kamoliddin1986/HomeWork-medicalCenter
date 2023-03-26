import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client, ClientSchema } from './schemas/client.schema';
import { Otp, OtpSchema } from '../otp/schemas/otp.schema';
import { Token, TokenSchema } from '../token/schemas/token.schema';
import { OtpModule } from '../otp/otp.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Client.name, schema: ClientSchema},
      {name: Otp.name, schema: OtpSchema}, 
      {name: Token.name, schema: TokenSchema}
   ]), 
   OtpModule,
   TokenModule,
   JwtModule.register({})
  ],
  controllers: [ClientController],
  providers: [ClientService]
})
export class ClientModule {}
