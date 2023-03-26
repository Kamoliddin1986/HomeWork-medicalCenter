import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecialistService } from './specialist.service';
import { AuthSpecialistDto } from './dto/auth-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { VerifyOtpDto } from '../otp/dto/verifyOtp.dto';
@Controller('specialist')
export class SpecialistController {
  constructor(private readonly specialistService: SpecialistService) {}



  @Post('auth')
  auth(@Body() authSpecialistDto: AuthSpecialistDto) {
    return this.specialistService.auth(authSpecialistDto);
  }


  @Post('verifyotp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.specialistService.verifyOtp(verifyOtpDto);
  }

  @Get()
  findAll() {
    return this.specialistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialistService.findOne(+id);
  }

  @Patch(':id')
  updateSpecialist(@Param('id') id: string, @Body() updateSpecialistDto: UpdateSpecialistDto) {
    return this.specialistService.updateSpecialist(id, updateSpecialistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialistService.remove(+id);
  }
}
