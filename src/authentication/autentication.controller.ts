import { Controller, UseInterceptors, ClassSerializerInterceptor, Body, Post, HttpCode, UseGuards, Req, Get, Delete } from "@nestjs/common";
import AuthenticationService from './authentication.service';
import RegisterDto from './dto/register.dto';
import User from '../users/user.entity';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
import JwtAuthenticationGuard from './jwt-authentication.guard';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
class AuthenticationController {

    constructor(
        private readonly authenticationService: AuthenticationService
    ) { }

    @Post('register')
    async register(@Body() registrationData: RegisterDto): Promise<User> {
        return this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUser): Promise<User> {
        const { user } = request;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        request.res.setHeader('Set-Hedaer', cookie)
        return user;
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    @HttpCode(200)
    async logOut(@Req() request: RequestWithUser): Promise<any> {
        request.res.setHeader('Set-Header',
            this.authenticationService.getCookieForLogOut())
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    async me(@Req() request: RequestWithUser): Promise<User> {
        return request.user;
    }

}
export default AuthenticationController;