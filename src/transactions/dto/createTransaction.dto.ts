import { IsDefined, IsString, IsOptional, IsNotEmpty, IsEnum, IsNumber, IsDate, IsBoolean, IsDecimal, IsDateString } from "class-validator"
import { TransactionType } from '../transaction.entity';
import Category from "src/categories/category.entity";

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
    public transactionDate: string

    @IsDefined()
    @IsDateString()
    public dueDate: string

    @IsDefined()
    // @IsBoolean()
    public paid: boolean

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    public category: Category

}