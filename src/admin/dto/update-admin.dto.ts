import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';

export class UpdatePassAdminDto{
    old_password: string;
    new_password: string;
    confirm_password: string
}
