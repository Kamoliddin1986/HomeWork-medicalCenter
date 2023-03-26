import { PartialType } from '@nestjs/mapped-types';

export class UpdateSpecialistDto  {
    spec_position: string;
    spec_last_name: string;
    spec_first_name: string;
    spec_middle_name?: string;
    spec_birthday?: Date;
    spec_photo?: string;
    spec_info?: string;
    show_position?: boolean;
    show_last_name?: boolean;
    show_middle_name?: boolean;
    show_birthday?: boolean;
    show_photo?: boolean;
    show_phone_number?: boolean;
}
