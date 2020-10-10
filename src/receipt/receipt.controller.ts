import { Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query } from "@nestjs/common";
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import { Receipt } from "./receipt.interface";
import ReceiptService from "./receipt.service";


@Controller('receipt')
@UseInterceptors(ClassSerializerInterceptor)
class CategoryController {

    constructor(
        private readonly receiptService: ReceiptService
    ) { }

    @Get('/catch')
    @UseGuards(JwtAuthenticationGuard)
    async getAllCategories(@Query() { code }: { code: string }): Promise<Receipt> {
        return this.receiptService.locateReceipt(code)
    }


}
export default CategoryController;