import {
    Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, Req,
} from "@nestjs/common";
import RequestWithUser from "src/authentication/requestWithUser.interface";
import FindAllTransactionParams from "src/transactions/findAllTransactionParams";
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import AttachmentService from './attachment.service';
import Attachment from './attachment.entity';


@Controller('attachment')
@UseInterceptors(ClassSerializerInterceptor)
class AttachmentController {

    constructor(
        private readonly attachmentService: AttachmentService
    ) { }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getAllTransactions(@Query() params: FindAllTransactionParams,
        @Req() request: RequestWithUser): Promise<Attachment[]> {
        const { results, count } = await this.attachmentService.getAllAttachments(params);
        request.res.setHeader('X-total-count', count);
        return results
    }

}
export default AttachmentController;