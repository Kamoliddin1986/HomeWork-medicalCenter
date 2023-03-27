import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from './../token/token.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { Token, TokenSchema } from '../token/schemas/token.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Admin.name, schema: AdminSchema},
    {name: Token.name, schema: TokenSchema}]),
    TokenModule,
    JwtModule.register({})],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
