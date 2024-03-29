import { IsDefined, IsString, IsOptional, IsNotEmpty, IsEnum, IsDateString, IsNumber } from "class-validator"
import Category from '../../categories/category.entity';
import { TransactionType } from '../transaction.entity';

export class UpdateTransactionDto {

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public name: string

    @IsString()
    @IsOptional()
    @IsOptional()
    public description: string

    @IsEnum(TransactionType)
    @IsOptional()
    public transactionType: TransactionType

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    public amount: number

    @IsDateString()
    @IsOptional()
    public transactionDate: Date

    @IsDateString()
    @IsOptional()
    public dueDate?: Date

    @IsDateString()
    @IsOptional()
    public paidDate?: Date

    @IsDefined()
    @IsOptional()
    public paid: boolean

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    public category: Category

    @IsOptional()
    public receiptAttachment?: number

    @IsOptional()
    public receiptKey?: string

}