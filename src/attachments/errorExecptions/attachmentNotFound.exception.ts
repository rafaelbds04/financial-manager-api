import { NotFoundException } from '@nestjs/common'

export default class AttachmentNotFoundException extends NotFoundException {
    constructor(attachmentKey: string) {
        super(`Attachment with key: ${attachmentKey} not found.`)
    }
}