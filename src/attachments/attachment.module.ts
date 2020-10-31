import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Attachment from "./attachment.entity";
import { ConfigService } from "@nestjs/config";
import AttachmentService from "./attachment.service";
import AttachmentController from './attachment.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Attachment]), ConfigService],
    providers: [AttachmentService, ConfigService],
    controllers: [AttachmentController],
    exports: [AttachmentService]
})
export default class AttachmentModule { }