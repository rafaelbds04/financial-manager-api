import {
    Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor,
    Param, Post, Body, Delete
} from "@nestjs/common";
import CategoryService from './category.service';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import Category from "./category.entity";
import FindByCategoryParams from './findByCategoryParams';
import CreateCategoryDto from './dto/createCategory.dto';
import FindOneParams from "src/utils/findOneParams";


@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getAllCategories(): Promise<Category[]> {
        return this.categoryService.getAllCategories()
    }

    @Get(':type')
    @UseGuards(JwtAuthenticationGuard)
    async getAllCategoriesByType(@Param() { type }: FindByCategoryParams): Promise<Category[]> {
        return this.categoryService.getAllCategoriesByType(type)
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createNewCategory(@Body() category: CreateCategoryDto): Promise<Category> {
        return this.categoryService.createCategory(category)
    }

    @Delete(':id')
    @UseGuards(JwtAuthenticationGuard)
    async deleteCategory(
        @Param() { id }: FindOneParams): Promise<void> {
        return this.categoryService.deleteCategoryById(Number(id));
    }

}
export default CategoryController;