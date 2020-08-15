import { Module } from "@nestjs/common";
import UserService from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "./user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
    providers: [UserService]
})
export default class UserModule { }