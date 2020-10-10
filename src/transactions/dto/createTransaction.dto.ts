import { IsDefined, IsString, IsOptional, IsNotEmpty, IsEnum, IsDecimal, IsDateString } from "class-validator"
import { TransactionType } from '../transaction.entity';

export class CreateTransactionDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public name: string

    @IsString()
    @IsOptional()
    public description?: string

    @IsDefined()
    @IsEnum(TransactionType)
    public transactionType: TransactionType

    @IsDefined()
    @IsNotEmpty()
    @IsDecimal()
    public amount: number

    @IsDefined()
    @IsDateString()
    public transactionDate: Date

    @IsOptional()
    @IsDateString()
    public dueDate?: Date

    @IsDefined()
    // @IsBoolean()
    public paid: boolean

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public category: number

    @IsOptional()
    public receiptAttachment?: number
}