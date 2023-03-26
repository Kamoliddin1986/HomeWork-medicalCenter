import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';
import { Specialist, SpecialistSchema } from './schemas/specialist.schema';
import { Otp, OtpSchema } from '../otp/schemas/otp.schema';
import { OtpModule } from '../otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { Token, TokenSchema } from '../token/schemas/token.schema';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Specialist.name, schema: SpecialistSchema},
      {name: Otp.name, schema: OtpSchema}, 
      {name: Token.name, schema: TokenSchema}
   ]), 
   OtpModule,
   TokenModule,
   JwtModule.register({})
  ],
  controllers: [SpecialistController],
  providers: [SpecialistService]
})
export class SpecialistModule {}
