import { IsString, Matches, Length } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره موبایل باید به فرمت 09xxxxxxxxx باشد' })
  mobile!: string;
}
