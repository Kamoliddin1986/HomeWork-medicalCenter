import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthClientDto } from './dto/auth-client.dto';
import { VerifyOtpDto } from '../otp/dto/verifyOtp.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('auth')
  auth(@Body() authClientDto: AuthClientDto) {
    return this.clientService.auth(authClientDto);
  }


  @Post('verifyotp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.clientService.verifyOtp(verifyOtpDto);
  }


  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  updateClient(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.updateClient(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id);
  }
}
