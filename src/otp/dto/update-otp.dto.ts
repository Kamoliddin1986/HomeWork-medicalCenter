import { PartialType } from '@nestjs/mapped-types';
import { CreateOtpDto } from './create-otp.dto';

export class UpdateOtpDto{
    otp?: string;
    verified?: boolean;
    expiretion_time?: string
}
