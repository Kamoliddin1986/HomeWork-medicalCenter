import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { OtpService } from './../otp/otp.service';
import { OtpModule } from './../otp/otp.module';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as otpGenerator from 'otp-generator'
import { AddMinutesToDate } from '../helpers/addMinutes';
import { Otp } from '../otp/schemas/otp.schema';
import { dates, decode, encode } from '../helpers/crypto';
import { VerifyOtpDto } from '../otp/dto/verifyOtp.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { TokenService } from '../token/token.service';
import { Client, ClientDocument } from './schemas/client.schema';
import { AuthClientDto } from './dto/auth-client.dto';

@Injectable()
export class ClientService {

  constructor(@InjectModel(Client.name) private clientModel: Model<ClientDocument>,
 private readonly otpService: OtpService, private readonly jwtService: JwtService,
 private readonly tokenService: TokenService ){}


 async auth(authClientDto: AuthClientDto) {
  const {phone_number} = authClientDto
  console.log('<<<<<<<>>>>>>>>>>');

  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
  
  const now = new Date()
  const expiretion_time = AddMinutesToDate(now,5)
  let otpId: string
  const client = await this.clientModel.findOne({client_phone_number: phone_number});
  if(client){
    const oldOtp = await this.otpService.findOneById(client.otp_id.toString())
    if(oldOtp){
      const updateOtp = await this.otpService.update(oldOtp._id.toString(),{otp: otp.toString(), expiretion_time: expiretion_time.toString(), verified: false});
      otpId = updateOtp._id.toString()
    }else{
      const newOtp = await this.otpService.create({
        otp,
        expiretion_time
      })
      otpId = newOtp._id.toString()
    }

  }else{
    const newOtp = await this.otpService.create({
      otp,
      expiretion_time
    })
    otpId = newOtp._id.toString()
  }

  
  const details = {
    timestamp: now,
    check: phone_number,
    success: true,
    message: "Otp send to user***",
    otp_id: otpId
  }

  const encoded = await encode(JSON.stringify(details));
  return {status: "Success", Details: encoded}
}


async verifyOtp(verifyOtpDto: VerifyOtpDto){
  const {verification_key,check, otp} = verifyOtpDto
  
  const currentDate = Date.now();
  const decod = await decode(verification_key);
  const obj = JSON.parse(decod);
  const phoneN_obj = obj.check;
  
  if(phoneN_obj != check) {
    throw new BadRequestException('Otp bu raqamga yuborilmagan')
  }

  const result = await this.otpService.findOneById(obj.otp_id)
  console.log('very>>>>>>',obj);
  
  if(result!=null){
    if(!result.verified){
      if(dates.compare(result.expiretion_time, currentDate)){
        if(otp === result.otp){
          const client = await this.clientModel.findOne({spec_phone_number: check});
          let cl_id: string;
          if(!client){
            const createClient = await this.clientModel.create({
              client_phone_number: check,
              otp_id: obj.otp_id
            })              
            cl_id = createClient._id.toString()
          }else{
            cl_id = client._id.toString()
          }        



          const updateOtp = await this.otpService.update(obj.otp_id,{verified: true})
          const tokens = await this.getToken(cl_id,check)
          
          const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token,7)

          const existstoken = await this.tokenService.findOne(cl_id);
          console.log(existstoken);
          
          if(existstoken){
            const updateToken = await this.tokenService.update(existstoken._id.toString(),{hashed_refresh_token})

          }else{
            const createdToken = await this.tokenService.create({
              table_name: 'client',
              user_id: cl_id,
              hashed_refresh_token
            })
          }


          const response = {
            message: 'Client created, please create other datas',
            access_token: tokens.access_token,
          }

          return response
        }else{
          throw new BadRequestException('OTP notugri')
        }
      }else{
        throw new BadRequestException('OTP expired')
      }

    }else{
      
      throw new BadRequestException('Bu OTP oldin foDALANILGAN')
    }

  }else{
    throw new BadRequestException('bunday OTP foydalanuvchiga yuborimagan')
  }
}
 
 async getToken(id: string, phone_number: string) {

  const jwtPayload = {
    id, phone_number
  }

  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(jwtPayload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME
    }),
    this.jwtService.signAsync(jwtPayload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME
    })
  ])

  return {
    access_token: accessToken,
    refresh_token: refreshToken
  }
}

 async findAll() {
    const allClients = await this.clientModel.find()
    return allClients;
  }

  async create(createClientDto: CreateClientDto){
    const cl = this.clientModel.create(createClientDto)
    return cl
  }

  async findOne(id: string) {
    const oneClient = await this.clientModel.findById(id)
    return oneClient;
  }

  // update(id: number, updateClientDto: UpdateClientDto) {
  //   return `This action updates a #${id} client`;
  // }

  async remove(id: string) {
    const delClient = await this.clientModel.findByIdAndDelete(id)
    return delClient;
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto) {
    const updatedSpecialist = await this.clientModel.findByIdAndUpdate(id, updateClientDto)

    return updatedSpecialist;
  }
}
