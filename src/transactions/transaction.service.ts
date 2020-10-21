import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import Transaction, { TransactionType } from './transaction.entity';
import { Between, FindConditions, Raw, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import User from '../users/user.entity';
import AttachmentService from '../attachments/attachment.service';
import TransactionNotFoundException from './errorExecptions/transactionNotFound.exception';
import Attachment from '../attachments/attachment.entity';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';
import CategoryService from '../categories/category.service';
import { PostgresErrorCode } from "src/database/PostgresErrorCode.enum";
import FindAllTransactionParams from './findAllTransactionParams';
import * as moment from "moment";

type TransactionTypeString = keyof typeof TransactionType

@Injectable()
export default class TransactionService {
    private readonly logger = new Logger(TransactionService.name);

    constructor(
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
        private readonly attachmentService: AttachmentService,
        private readonly categoryService: CategoryService
    ) { }

    async getAllTransactions(params: FindAllTransactionParams): Promise<{ results: Transaction[], count: number }> {
        const { take, skip, from, to, name, ...lastparams } = params
        const fromDate = from || moment().subtract(30, 'days').format();
        const toDate = to || moment().format();

        //Where conditionals
        const where: FindConditions<Transaction> = {
            transactionDate: Between(fromDate, toDate),
            name: Raw(alias => `${alias} ILIKE '%${name}%'`),
            ...lastparams
        }
        !name && delete where.name

        const [results, count] = await this.transactionRepository.findAndCount({
            relations: ['category'],
            select: ['id', 'name', 'amount', 'transactionType', 'transactionDate', 'dueDate', 'paid'],
            take: take || 10,
            skip: skip || 0,
            order: { transactionDate: 'DESC' },
            where
        });

        return { results, count }
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
        const { receiptAttachment, category, ...transactionInputData } = transactionData;

        if (transactionData.receiptKey) {
            const existReicpt = await this.transactionRepository.count({ receiptKey: transactionData.receiptKey })
            if (existReicpt) throw new HttpException('Uma transação com essa NF já existe', HttpStatus.BAD_REQUEST)
        }

        const categoryResult = await this.categoryService.getCategoryById(category);
        if (!categoryResult) throw new HttpException('Essa categoria não existe', HttpStatus.NOT_FOUND)

        if (receiptAttachment) {
            const receiptAttachmentResult = await this.attachmentService.getAttachmentById(receiptAttachment);
            if (!receiptAttachmentResult) throw new HttpException('Esse anexo de NF não existe', HttpStatus.NOT_FOUND)
        }

        try {
            const newTransaction = this.transactionRepository.create({
                ...transactionInputData,
                category: categoryResult,
                author: user,
            })

            const createdTransaction = await this.transactionRepository.save(newTransaction);

            files.forEach(async (file: Express.Multer.File) => {
                await this.attachmentService.createAttachment(file.buffer, createdTransaction)
            })

            receiptAttachment && this.attachmentService
                .addAttachmentToTransaction(receiptAttachment, createdTransaction)

            return createdTransaction;
        } catch (error) {
            this.logger.error(error);
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('This transaction already exit',
                    HttpStatus.BAD_REQUEST);
            }
            if (error?.code === PostgresErrorCode.ForeignKeyViolation) {
                throw new HttpException(error?.detail,
                    HttpStatus.BAD_REQUEST);
            }

        }
        throw new HttpException('Something with that wrong',
            HttpStatus.INTERNAL_SERVER_ERROR);

    }

    async updateTransaction(transactionId: number, transactionData: UpdateTransactionDto): Promise<Transaction> {
        await this.transactionRepository.update({ id: transactionId }, transactionData)
        const updatedTransaction = await this.transactionRepository.findOne(transactionId);
        if (updatedTransaction) {
            return updatedTransaction;
        }
        throw new TransactionNotFoundException(transactionId);
    }

    async deleteTransaction(transactionId: number): Promise<void> {
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
            this.logger.error(error);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTotalByTypeOfThisMonth(type: TransactionTypeString): Promise<number> {
        try {
            const data = await this.transactionRepository.manager.
                createQueryBuilder(Transaction, 'Transaction')
                .where("Transaction.transactionType = :type", { type: type.toLowerCase() })
                .andWhere("Transaction.transactionDate >= date_trunc('month', CURRENT_DATE)")
                .select("SUM(Transaction.amount)", "total")
                .getRawOne();
            return data.total;
        } catch (error) {
            this.logger.error(error);
        }
    }

    async getTotalDue(): Promise<number> {
        try {
            const data = await this.transactionRepository.manager.
                createQueryBuilder(Transaction, 'Transaction')
                .where("Transaction.paid = :paid", { paid: false })
                .andWhere("Transaction.dueDate >= date_trunc('hour', CURRENT_DATE)")
                .select("SUM(Transaction.amount)", "total")
                .getRawOne();
            return data.total;
        } catch (error) {
            console.log(error)
        }
    }

    async getTotalOverDue(): Promise<number> {
        try {
            const data = await this.transactionRepository.manager.
                createQueryBuilder(Transaction, 'Transaction')
                .where("Transaction.paid = :paid", { paid: false })
                .andWhere("Transaction.dueDate < date_trunc('hour', CURRENT_DATE)")
                .select("SUM(Transaction.amount)", "total")
                .getRawOne();
            return data.total;
        } catch (error) {
            console.log(error)
        }
    }

}