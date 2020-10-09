/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, UseGuards, UploadedFiles, UseInterceptors, ClassSerializerInterceptor, Get, Body, Req, Param, Delete, Patch } from "@nestjs/common";
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '../attachments/imageFileFilter';
import TransactionService from "./transaction.service";
import { Express } from 'express'
import { CreateTransactionDto } from "./dto/createTransaction.dto";
import FindOneParams from '../utils/findOneParams';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';
import Transaction from "./transaction.entity";

@Controller('transactions')
@UseInterceptors(ClassSerializerInterceptor)
export default class TransactionController {

    constructor(private readonly transactionService: TransactionService) { }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getAllTransactions() {
        return this.transactionService.getAllTransactions();
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    async getTransactionsById(@Param() { id }: FindOneParams) {
        return await this.transactionService.getTransactionById(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FilesInterceptor('files', 20, { fileFilter: imageFileFilter }))
    async createNewTransaction(
        @Req() request: RequestWithUser,
        @Body() transactionData: CreateTransactionDto,
        @UploadedFiles() files: Express.Multer.File[]) {
        return this.transactionService.createTransaction(request.user, transactionData, files)
    }

    @Patch(':id')
    @UseGuards(JwtAuthenticationGuard)
    async updateTransaction(@Param() { id }: FindOneParams,
        @Body() transactionToUpdateData: UpdateTransactionDto): Promise<Transaction> {
        return await this.transactionService.updateTransaction(Number(id), transactionToUpdateData)
    }

    @Delete(':id')
    @UseGuards(JwtAuthenticationGuard)
    async deleteTransaction(
        @Req() request: RequestWithUser,
        @Param() { id }: FindOneParams) {
        return this.transactionService.deleteTransaction(Number(id))
    }

}