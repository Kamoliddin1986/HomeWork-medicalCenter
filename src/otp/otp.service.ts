import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OtpService {

  constructor(@InjectModel(Otp.name) private otpModel: Model<OtpDocument>){}


  async create(createOtpDto: CreateOtpDto) {
    
    const createOtp = await this.otpModel.create(createOtpDto)
    return createOtp;
  }

  findAll() {
    return `This action returns all otp`;
  }

  async findOneById(id: string) {
    const otp = await this.otpModel.findById(id)
    return otp
  }

  async update(id: string, updateOtpDto: UpdateOtpDto) {
    const updateOtp = await this.otpModel.findByIdAndUpdate(id, updateOtpDto, {new: true}).exec()
    return updateOtp;
  }

  async remove(id: string) {
    const deleteOtp = await this.otpModel.findByIdAndDelete(id)
    return deleteOtp;
  }

  async findOne(key: any, value: any ){
    const findedOtp = await this.otpModel.findOne({key: value})
    return findedOtp
  }
}
