import { Controller, Get, UseInterceptors, ClassSerializerInterceptor, UseGuards } from "@nestjs/common";
import JwtAuthenticationGuard from "src/authentication/jwt-authentication.guard";
import Stats from "./stats.entity";
import StatsService from "./stats.service";


@Controller('stats')
@UseInterceptors(ClassSerializerInterceptor)
class StatsController {

    constructor(
        private readonly statsService: StatsService
    ) { }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getAllCategories(): Promise<Stats> {
        return await this.statsService.getAllStats();
    }

    @Get('forceupdate')
    @UseGuards(JwtAuthenticationGuard)
    async updateStats(): Promise<Stats> {
        return await this.statsService.updateStats();
    }

}
export default StatsController;