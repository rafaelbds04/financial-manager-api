import { NotFoundException } from '@nestjs/common'

export default class TransactionNotFoundException extends NotFoundException {
    constructor(transactionId: number) {
        super(`Transaction with id: ${transactionId} not found.`)
    }
}