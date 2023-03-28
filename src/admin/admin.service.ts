import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from './admin.module';
import { Request } from 'express';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdatePassAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocment } from './schemas/admin.schema';
import { Model, Models } from 'mongoose';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { SpecialistService } from '../specialist/specialist.service';

@Injectable()
export class AdminService {


  constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocment>, 
  private readonly jwtService: JwtService,
 private readonly tokenService: TokenService,
 private readonly specialistService: SpecialistService ){}


  async create(createAdminDto: CreateAdminDto) {
    const admin_hashed_password = await bcrypt.hash(createAdminDto.password,7)
    return this.adminModel.create({...createAdminDto,admin_hashed_password})
  }

  async updatePass (id: string, updatePassAdminDto: UpdatePassAdminDto, res: Request){

    const updatedPassAdmin = await this.adminModel.findByIdAndUpdate()
    return 's'
  }

  async loginAdmin(loginAdminDto: LoginAdminDto){
    const oneAdmin = await this.adminModel.findOne({admin_name: loginAdminDto.admin_name})
    const passStatus = await bcrypt.compare(loginAdminDto.password, oneAdmin.admin_hashed_password);
    if(!passStatus) {
      throw new BadRequestException("parol notugri")
    }
    const tokens = await this.specialistService.getToken(oneAdmin._id.toString(),oneAdmin.admin_phone_number);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token,7)

    const existsToken = await this.tokenService.findOne(oneAdmin._id.toString());
    if(existsToken){
      const updateToken = await this.tokenService.update(existsToken._id.toString(),{hashed_refresh_token})

    }else{
      const createdToken = await this.tokenService.create({
        table_name: 'admin',
        user_id: oneAdmin._id.toString(),
        hashed_refresh_token
      })
    }

    const response = {
      message: 'Admin logined',
      access_token: tokens.access_token,
    }

    return response

      // const hashed_new_pass = await bcrypt.hash(loginAdminDto.password,7)
      // const loginedAdmin = await this.adminModel.findByIdAndUpdate(oneAdmin._id, {admin_hashed_password: hashed_new_pass})
      
      // return {message: "Parol o'xgardi",loginedAdmin}    
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
