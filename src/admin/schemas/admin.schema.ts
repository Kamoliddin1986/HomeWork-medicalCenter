import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose";


export type AdminDocment = HydratedDocument<Admin>

@Schema()
export class Admin {
    @Prop({required: true})
    admin_name: string;
    @Prop({required: true})
    admin_phone_number: string;
    @Prop({required: true})
    admin_hashed_password: string;
    @Prop({default: true})
    admin_is_active: string;
    @Prop({default: false})
    admin_is_creator: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin)
