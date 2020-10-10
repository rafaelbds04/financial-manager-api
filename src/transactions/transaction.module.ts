import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Transaction from './transaction.entity';
import TransactionController from './transaction.controller';
import AttachmentModule from '../attachments/attachment.module';
import TransactionService from "./transaction.service";
import CategoryModule from "src/categories/category.module";

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), AttachmentModule, CategoryModule],
    controllers: [TransactionController],
    providers: [TransactionService],
    exports: [TransactionService]
})
export default class TransactionModule { }