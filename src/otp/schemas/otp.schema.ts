import { Schema,Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';




export type OtpDocument = HydratedDocument<Otp>

@Schema()
export class Otp {
    @Prop()
    otp: string;

    @Prop()
    expiretion_time: Date;

    @Prop({default: false})
    verified: boolean;

}

export const OtpSchema = SchemaFactory.createForClass(Otp)
