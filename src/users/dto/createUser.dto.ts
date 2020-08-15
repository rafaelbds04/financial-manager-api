import { IsDefined, IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class CreateUserDto {

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
    @MinLength(8)
    password: string
}