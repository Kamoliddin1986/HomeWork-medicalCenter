import { OtpService } from './../otp/otp.service';
import { OtpModule } from './../otp/otp.module';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthSpecialistDto } from './dto/auth-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { Specialist, SpecialistDocument } from './schemas/specialist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as otpGenerator from 'otp-generator'
import { AddMinutesToDate } from '../helpers/addMinutes';
import { Otp } from '../otp/schemas/otp.schema';
import { dates, decode, encode } from '../helpers/crypto';
import { VerifyOtpDto } from '../otp/dto/verifyOtp.dto';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { CreateSpecialistDto } from './dto/create-spacialist.dto';
import { JwtService } from '@nestjs/jwt';
// import { OtpService } from '../otp/otp.service';
import * as bcrypt from 'bcrypt'
import { TokenService } from '../token/token.service';
@Injectable()
export class SpecialistService {

  constructor(@InjectModel(Specialist.name) private specialistModel: Model<SpecialistDocument>,
 private readonly otpService: OtpService, private readonly jwtService: JwtService,
 private readonly tokenService: TokenService ){}
  
  
  async auth(authSpecialistDto: AuthSpecialistDto) {
    const {phone_number} = authSpecialistDto

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });
    
    const now = new Date()
    const expiretion_time = AddMinutesToDate(now,5)
    // console.log(expiretion_time);
    let otpId: string
    const specialist = await this.specialistModel.findOne({spec_phone_number: phone_number});
    if(specialist){
      const oldOtp = await this.otpService.findOneById(specialist.otp_id.toString())
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
    
    if(result!=null){
      if(!result.verified){
        if(dates.compare(result.expiretion_time, currentDate)){
          if(otp === result.otp){
            const specialist = await this.specialistModel.findOne({spec_phone_number: check});
            let sp_id: string;
            if(!specialist){
              const createSpecialist = await this.specialistModel.create({
                spec_phone_number: check,
                otp_id: obj.otp_id
              })              
              sp_id = createSpecialist._id.toString()
            }else{
              sp_id = specialist._id.toString()
            }        



            const updateOtp = await this.otpService.update(obj.otp_id,{verified: true})
            const tokens = await this.getToken(sp_id,check)
            
            const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token,7)

            const existstoken = await this.tokenService.findOne(sp_id);
            console.log(existstoken);
            
            if(existstoken){
              const updateToken = await this.tokenService.update(existstoken._id.toString(),{hashed_refresh_token})

            }else{
              const createdToken = await this.tokenService.create({
                table_name: 'specialist',
                user_id: sp_id,
                hashed_refresh_token
              })
            }


            const response = {
              message: 'User created, please create other datas',
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

  findAll() {
    return `This action returns all specialist`;
  }

  async create(createSpecialistDto: CreateSpecialistDto){
    const cr = this.specialistModel.create(createSpecialistDto)
    return cr
  }

  findOne(id: number) {
    return `This action returns a #${id} specialist`;
  }

  async updateSpecialist(id: string, updateSpecialistDto: UpdateSpecialistDto) {
    const updatedSpecialist = await this.specialistModel.findByIdAndUpdate(id, updateSpecialistDto)

    return `This action updates a #${id} specialist`;
  }

  remove(id: number) {
    return `This action removes a #${id} specialist`;
  }
}
