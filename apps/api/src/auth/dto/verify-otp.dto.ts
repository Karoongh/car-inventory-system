import { IsString, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @Matches(/^09\d{9}$/, { message: 'شماره موبایل باید به فرمت 09xxxxxxxxx باشد' })
  mobile!: string;

  @IsString()
  @Length(4, 6, { message: 'کد تایید باید بین ۴ تا ۶ رقم باشد' })
  code!: string;
}
