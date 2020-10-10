import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Category, { CategoryType } from './category.entity';
import { Repository } from "typeorm";
import CreateCategoryDto from './dto/createCategory.dto';
import { PostgresErrorCode } from "src/database/PostgresErrorCode.enum";


@Injectable()
class CategoryService {

    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ) { }

    getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = this.categoryRepository.findOne({ id: Number(id) })
        if (category) return category;
        throw new HttpException('This category does not exist', HttpStatus.NOT_FOUND)
    }

    async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
        try {
            const newCategory = this.categoryRepository.create(categoryData);
            await this.categoryRepository.save(newCategory);
            return newCategory;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException('Category with this name already exit',
                    HttpStatus.BAD_REQUEST);
            }
        }

        throw new HttpException('Something with that wrong',
            HttpStatus.INTERNAL_SERVER_ERROR);

    }

    async getAllCategoriesByType(categoryType: CategoryType): Promise<Category[]> {
        const result = await this.categoryRepository.find({ where: [{ categoryType }] })
        return result;
    }

    async deleteCategoryById(id: number): Promise<void> {
        try {
            const category = await this.categoryRepository.delete({ id: Number(id) })
            if (!category.affected) {
                throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw new HttpException('Something with that wrong',
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
export default CategoryService;