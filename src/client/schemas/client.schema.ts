import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>

@Schema()
export class Client {

@Prop()
client_last_name: string;

@Prop()
client_first_name: string;

@Prop({required: true})
client_phone_number: string;

@Prop()
client_info: string;

@Prop()
client_photo: string;

@Prop({default: true})
client_is_active: boolean;

@Prop()
otp_id: string;


}

export const ClientSchema = SchemaFactory.createForClass(Client)
