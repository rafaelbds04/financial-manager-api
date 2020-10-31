import { Type } from "class-transformer";
import { IsDateString, IsOptional, IsNumber, Max } from "class-validator";

class FindParams {

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
    @IsDateString()
    from?: Date

    @IsOptional()
    @IsDateString()
    to?: Date
}

export default FindParams