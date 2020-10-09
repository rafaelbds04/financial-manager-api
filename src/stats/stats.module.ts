import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Stats from "./stats.entity";
import StatsController from "./stats.controller";
import StatsService from "./stats.service";
import TransactionModule from "src/transactions/transaction.module";

@Module({
    imports: [TypeOrmModule.forFeature([Stats]), TransactionModule],
    controllers: [StatsController],
    providers: [StatsService],
})
export default class StatsModule { }