import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Transaction from './transaction.entity';
import TransactionController from './transaction.controller';
import AttachmentModule from '../attachments/attachment.module';
import TransactionService from "./transaction.service";

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), AttachmentModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService]
})
export default class TransactionModule { }