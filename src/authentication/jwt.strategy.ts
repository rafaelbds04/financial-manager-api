import { Injectable } from "@nestjs/common";
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from "passport-jwt";
import User from '../users/user.entity';
import { PassportStrategy } from "@nestjs/passport";
import  UserService  from "src/users/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication;
            }]),
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: TokenPayload): Promise<User> {
        return this.userService.getUserById(payload.userId);
    }

}