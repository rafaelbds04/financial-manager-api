import { IsDefined, IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export default class RegisterDto {

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name: string

    @IsDefined()
    @IsEmail()
    @IsNotEmpty()
    email: string 

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password: string
}