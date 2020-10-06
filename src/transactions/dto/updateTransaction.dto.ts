import { IsDefined, IsString, IsOptional, IsNotEmpty, IsEnum, IsDecimal, IsDateString } from "class-validator"
import { TransactionType } from '../transaction.entity';
import Category from "src/categories/category.entity";

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
    @IsDecimal()
    @IsOptional()
    public amount: number

    @IsDateString()
    @IsOptional()
    public transactionDate: string

    @IsDateString()
    @IsOptional()
    public dueDate: string

    @IsDefined()
    @IsOptional()
    public paid: boolean

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public category: Category

}