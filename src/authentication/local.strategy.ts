import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import  AuthenticationService  from "./authentication.service";
import User from "src/users/user.entity";
import { Strategy } from 'passport-local';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authenticationService: AuthenticationService) {
        super({
            usernameField: 'email'
        })
    }

    //For every strategy, Passport calls the validate function using a set of parameters specific for a particular strategy
    async validate(email: string, password: string): Promise<User> {
        return this.authenticationService.getAuthenticatedUser(email, password);
    }
}