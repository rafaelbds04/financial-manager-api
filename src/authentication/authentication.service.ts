import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { PostgresErrorCode } from 'src/database/PostgresErrorCode.enum';
import * as bcrypt from 'bcrypt'
import UserService from '../users/user.service';
import User from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'

@Injectable()
class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { };

    public async register(registrationData: RegisterDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.userService.createUser({
                ...registrationData,
                password: hashedPassword
            });
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('User with that email already exit',
                    HttpStatus.BAD_REQUEST);
            }
        }

        throw new HttpException('Something with that wrong',
            HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string): Promise<User> {
        try {
            const user = await this.userService.getUserByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            user.password = undefined; //TODO: UPDATE TO BETTER PRATICES
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided',
                HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyPassword(plainTextPassword: string,
        hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided',
                HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieWithJwtToken(userId: number): string {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; ` +
            `Max-Age=${this.configService.get('JWT_EXPIRES_TIME')}`
    }

    public getCookieForLogOut(): string {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`
    }

}

export default AuthenticationService;