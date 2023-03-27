import { JwtService } from '@nestjs/jwt';
import { AdminModule } from './admin.module';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdatePassAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocment } from './schemas/admin.schema';
import { Model, Models } from 'mongoose';
import { TokenService } from '../token/token.service';

@Injectable()
export class AdminService {


  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocment>, 
  private readonly jwtService: JwtService,
 private readonly tokenService: TokenService ){}


  create(createAdminDto: CreateAdminDto) {
    
    return this.adminModel.create({...createAdminDto,admin_hashed_password: createAdminDto.password})
  }

  async updatePass (updatePassAdminDto: UpdatePassAdminDto, res: Request){
    return 's'

  }

  

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
