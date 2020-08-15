import { IsNotEmpty, IsDefined, IsEnum } from "class-validator";
import { CategoryType } from "./category.entity";

export default class FindByCategoryParams {
    @IsDefined()
    @IsNotEmpty()
    @IsEnum(CategoryType)
    type: CategoryType
}