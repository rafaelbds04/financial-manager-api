import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Attachment from "./attachment.entity";
import AttachmentService from "./attachment.service"; 
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
    imports: [TypeOrmModule.forFeature([Attachment]), ConfigService],
    providers: [AttachmentService, ConfigService],
    exports: [AttachmentService]
})
export default class AttachmentModule { }