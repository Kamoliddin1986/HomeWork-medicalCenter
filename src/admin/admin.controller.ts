import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Request } from 'express';
import { UpdatePassAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Patch()
  updatePass(@Body() updatePassAdminDto: UpdatePassAdminDto,
  @Param('id') id: string,  @Req() request: Request) {
    
    return this.adminService.updatePass(id, updatePassAdminDto, request)
  }

  @Post('login')
  loginAdmin(@Body() loginAdminDto: LoginAdminDto){
    return this.adminService.loginAdmin(loginAdminDto)
  }
  
  


  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
