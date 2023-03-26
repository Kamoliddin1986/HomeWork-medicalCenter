import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SpecialistDocument = HydratedDocument<Specialist>

@Schema()
export class Specialist {
    @Prop()
    spec_position: string;

    @Prop()
    spec_last_name: string;

    @Prop()
    spec_first_name: string;

    @Prop()
    spec_middle_name: string;

    @Prop()
    spec_birthday: Date;

    @Prop()
    spec_photo: string;

    @Prop({required: true})
    spec_phone_number: string;

    @Prop()
    spec_info: string;

    @Prop({default: true})
    spec_is_active: string;

    @Prop({default: true})
    show_position: boolean;

    @Prop({default: true})
    show_last_name: boolean;

    @Prop({default: true})
    show_middle_name: boolean;

    @Prop({default: true})
    show_birthday: boolean;

    @Prop({default: true})
    show_photo: boolean;

    @Prop({default: true})
    show_phone_number: boolean;

    @Prop({required:true})
    otp_id: string;
}


export const SpecialistSchema = SchemaFactory.createForClass(Specialist)
