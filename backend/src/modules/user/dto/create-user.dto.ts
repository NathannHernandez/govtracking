import { IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsInt()
    userId : string;

    @IsString()
    firstName?: string;

    @IsString()
    lastName?: string;
    
    @IsEmail()
    email?: string;

    @IsString()
    username?: string;

    @IsString()
    @MinLength(6)
    password?: string;

    @IsPhoneNumber('PH')
    phone?: string;
}
