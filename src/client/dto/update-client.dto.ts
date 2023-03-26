import { Schema } from '@nestjs/mongoose';
import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';

@Schema()
export class UpdateClientDto{
client_last_name?: string;
client_first_name?: string;
client_info?: string;
client_photo?: string;
}
