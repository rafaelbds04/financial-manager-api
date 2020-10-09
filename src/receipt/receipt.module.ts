import { Module } from "@nestjs/common";
import ReceiptService from './receipt.service';
import ReceiptController from './receipt.controller';
import AttachmentModule from "src/attachments/attachment.module";

@Module({
    imports: [AttachmentModule],
    controllers: [ReceiptController],
    providers: [ReceiptService],
})
export default class ReceiptModule { }