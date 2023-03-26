import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument} from "mongoose";

export type tokenDokument = HydratedDocument<Token>


@Schema()
export class Token {
    @Prop({required: true})
    table_name: string;
    @Prop({required: true})
    user_id: string;
    @Prop({default: null})
    user_os: string;
    @Prop({default: null})
    user_device: string;
    @Prop({required: true})
    hashed_refresh_token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token)
