import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import Transaction from './transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { Express } from 'express'
import User from '../users/user.entity';
import AttachmentService from '../attachments/attachment.service';
import TransactionNotFoundException from './errorExecptions/transactionNotFound.exception';
import Attachment from '../attachments/attachment.entity';
import { async } from "rxjs";
import { UpdateTransactionDto } from './dto/updateTransaction.dto';


@Injectable()
export default class TransactionService {

    constructor(
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
        private readonly attachmentService: AttachmentService
    ) { }

    getAllTransactions(): Promise<Transaction[]> {
        return this.transactionRepository.find({
            relations: ['category'],
            select: ['id', 'name', 'amount', 'transactionType', 'transactionDate']
        });
    }

    async getTransactionById(id: number): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOne(id, {
            relations: ['attachments', 'author', 'category']
        });

        if (transaction) {
            return transaction;
        }

        throw new TransactionNotFoundException(id);
    }

    async createTransaction(user: User, transactionData: CreateTransactionDto,
        files: Express.Multer.File[]): Promise<Transaction> {
        const newTransaction = this.transactionRepository.create({
            ...transactionData,
            author: user,
        })

        const createdTransaction = await this.transactionRepository.save(newTransaction);

        files.forEach(async (file: Express.Multer.File) => {
            await this.attachmentService.createAttachment(createdTransaction, file.buffer)
        })

        return createdTransaction;

    }

    async updateTransaction(transactionId: number, trabsactionData: UpdateTransactionDto): Promise<Transaction> {
        console.log(transactionId);
        console.log(trabsactionData);
        await this.transactionRepository.update({ id: transactionId }, trabsactionData)
        const updatedTransaction = await this.transactionRepository.findOne(transactionId);
        if (updatedTransaction) {
            return updatedTransaction;
        }
        throw new TransactionNotFoundException(transactionId);
    }

    async deleteTransaction(transactionId: number): Promise<any> {
        try {
            const transactionToDelete = await this.transactionRepository.findOne(transactionId, {
                relations: ['attachments']
            });

            if (!transactionToDelete) {
                throw new TransactionNotFoundException(transactionId);
            }

            await this.transactionRepository.delete(transactionToDelete.id);
            //Deleting attachments from this transaction
            transactionToDelete.attachments.forEach(
                async (attachment: Attachment) => await this.attachmentService.deleteAttachmentByKey(attachment.key)
                    .catch(() => { throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR) }))

        } catch (error) {
            if (error?.status === 404) throw new TransactionNotFoundException(transactionId);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}