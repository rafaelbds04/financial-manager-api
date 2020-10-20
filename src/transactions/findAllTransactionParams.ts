import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsNumber, Max, IsNumberString } from "class-validator";
import Category from "src/categories/category.entity";
import { TransactionType } from "./transaction.entity";

class FindAllTransactionParams {

    @IsOptional()
    @IsNumber()
    @Max(200)
    @Type(() => Number)
    take?: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    skip?: number

    @IsOptional()
    name?: string

    @IsOptional()
    @IsDateString()
    from?: Date

    @IsOptional()
    @IsDateString()
    to?: Date

    @IsOptional()
    public paid: boolean

    @IsOptional()
    @IsEnum(TransactionType)
    public transactionType?: TransactionType

    @IsOptional()
    @IsNumberString()
    public category: Category
    
}

export default FindAllTransactionParams