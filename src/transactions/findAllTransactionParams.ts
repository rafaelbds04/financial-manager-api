import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsNumber, Max } from "class-validator";
import { TransactionType } from "./transaction.entity";

export default class FindAllTransactionParams {

    @IsOptional()
    @IsNumber()
    @Max(200)
    @Type(() => Number)
    take?: number

    @IsOptional()
    @IsNumber()
    @Max(200)
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
    @IsEnum(TransactionType)
    public transactionType?: TransactionType
}