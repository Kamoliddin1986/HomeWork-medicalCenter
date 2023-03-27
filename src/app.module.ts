import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpecialistModule } from './specialist/specialist.module';
import { ClientModule } from './client/client.module';
import { OtpModule } from './otp/otp.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from './token/token.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }),
  MongooseModule.forRoot(process.env.MONGO_URI),
  SpecialistModule, ClientModule, OtpModule, TokenModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
