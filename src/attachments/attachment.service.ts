import { Injectable, HttpStatus, HttpException } from "@nestjs/common";
import Attachment from './attachment.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as sharp from 'sharp';
import * as path from "path";
import { v4 as uuid } from 'uuid';
import Transaction from "src/transactions/transaction.entity";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";


@Injectable()
export default class AttachmentService {

    constructor(
        @InjectRepository(Attachment)
        private attachmentRepository: Repository<Attachment>,
        private readonly configService: ConfigService
    ) { }

    async getAttachmentById(id: number): Promise<Attachment> {
        const attachment = this.attachmentRepository.findOne({ id: Number(id) })
        if (attachment) return attachment;
        throw new HttpException('This attachment does not exist', HttpStatus.NOT_FOUND)
    }

    async createAttachment(fileBuffer: Buffer, transaction?: Transaction): Promise<Attachment> {
        try {
            const fileUuid = uuid()
            await sharp(fileBuffer).resize({ quality: 70 }).toFile(
                path.resolve(__dirname, '../../', this.configService.get('UPLOADS_DEST'), fileUuid + '.jpg'))

            const newAttachment = this.attachmentRepository.create({
                key: fileUuid,
                url: this.configService.get('UPLOADS_URL_DEST') + fileUuid + '.jpg',
                transaction,
            })

            const createdAttachment = this.attachmentRepository.save(newAttachment)

            return createdAttachment;
        } catch (error) {
            console.log(error);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Function to delete attachments of a transaction by key
    async deleteAttachmentByKey(key: string): Promise<any> {

        const deletedAttachment = await this.attachmentRepository.delete({ key: key })

        if (!deletedAttachment.affected) {
            throw new HttpException('Attachment not found', HttpStatus.NOT_FOUND);
        }
        //Deleting storaged file.
        fs.unlinkSync(path.resolve(__dirname, '../../', this.configService.get('UPLOADS_DEST'), key + '.jpg'))

        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);

    }

    async addAttachmentToTransaction(attachmentId: number, transaction: Transaction): Promise<Attachment> {
        await this.attachmentRepository.update({ id: attachmentId }, { transaction })
        const updatedAttachment = await this.attachmentRepository.findOne(attachmentId);
        if (updatedAttachment) {
            return updatedAttachment;
        }
        throw new HttpException('Attachment not found', HttpStatus.NOT_FOUND);
    }

    //Function to delete attachments of a transaction by id
    async deleteAttachmentById(id: number): Promise<any> {
        const attachmentoToDelete = await this.attachmentRepository.findOne(id)

        if (!attachmentoToDelete) {
            throw new HttpException('Attachment not found', HttpStatus.NOT_FOUND);
        }

        await this.attachmentRepository.delete(attachmentoToDelete)
        //Deleting storaged file.
        fs.unlinkSync(path.resolve(__dirname, '../../', this.configService.get('UPLOADS_DEST'), attachmentoToDelete.key + '.jpg'))
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

}