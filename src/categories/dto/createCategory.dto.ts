import { CategoryType } from "../category.entity"
import { IsDefined, IsString, IsNotEmpty, IsEnum } from 'class-validator';

export default class CreateCategoryDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    name: string
    
    @IsString()
    description: string

    @IsDefined()
    @IsNotEmpty()
    @IsEnum(CategoryType)
    categoryType: CategoryType
}