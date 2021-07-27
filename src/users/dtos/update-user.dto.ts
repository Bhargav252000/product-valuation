import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(2, 50)
  name: string;

  @IsEmail()
  @IsOptional()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password: string;
}
