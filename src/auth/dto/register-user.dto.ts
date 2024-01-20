import { IsEmail, IsString, MinLength } from "class-validator";


export class RegisterUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
    
    // @MinLength(6)
    // password2: string;

    // @IsString()
    // roles: string[];

}