import Attachment from "src/attachments/attachment.entity";

export interface Receipt {
    emitter?: string,
    totalAmount?: number
    emittedDate?: string
    error?: string,
    attachment?: Attachment
}