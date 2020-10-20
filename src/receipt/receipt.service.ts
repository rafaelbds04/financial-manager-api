import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import * as moment from 'moment-timezone';
import * as puppeteer from 'puppeteer'
import AttachmentService from "src/attachments/attachment.service";
import { Receipt } from "./receipt.interface";

interface SrapingReceipt {
    error?: string;
    emitter?: string;
    totalAmount?: number;
    generalInfos?: string;
    screenshot?: Buffer;
    receiptKey?: string,
}

@Injectable()
class ReceiptService {
    private readonly logger = new Logger(ReceiptService.name);

    constructor(
        private readonly attachmentService: AttachmentService
    ) { }

    async locateReceipt(receiptCode: string): Promise<Receipt> {
        if (receiptCode.includes('fazenda.rj.gov.br')) {
            try {
                //Get NFc-e qr code params 
                const params = receiptCode.split('p=')[1].split('|')
                //Check if is emitted offiline/contigency from url receipt params 
                const emittedOffline = params.length > 5 ? true : false
                //Fetch receipt informations using web scraping
                const scrapingResult = await this.scrapingReceipt(
                    new URL('http://www4.fazenda.rj.gov.br/consultaNFCe/QRCode?p=' +
                        receiptCode.split('p=')[1]).toString());

                if (scrapingResult.error) {
                    if (emittedOffline) {
                        return {
                            receiptKey: params[0],
                            totalAmount: Number(params[4]),
                            error: scrapingResult.error
                        }
                    }
                    throw new HttpException(scrapingResult.error, HttpStatus.INTERNAL_SERVER_ERROR)
                }

                const noteInformations = scrapingResult.generalInfos.split(' ');
                const emissaoIndex = noteInformations.indexOf('Emissão:')

                //Get next 2 index in the array, there is a date.
                const unformattedDate = noteInformations[emissaoIndex + 1] + ' ' + noteInformations[emissaoIndex + 2]
                const emittedDate = moment.tz(unformattedDate, "DD/MM/YYYY hh:mm:ss", 'America/Sao_Paulo').utc().toISOString();

                //Adding fiscal note do attachment 
                const screenshot = await this.attachmentService.createAttachment(scrapingResult.screenshot);

                delete scrapingResult.screenshot;
                delete scrapingResult.generalInfos;
                return { ...scrapingResult, attachment: screenshot, emittedDate }

            } catch (error) {
                if (error?.name === 'TimeoutError') throw new HttpException('Erro tempo limite excedido', HttpStatus.REQUEST_TIMEOUT);
                this.logger.error((typeof error == 'object' ? JSON.stringify(error) : error.message));
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new HttpException('Wrong code provided', HttpStatus.BAD_REQUEST)
        }


    }

    public async scrapingReceipt(url: string): Promise<SrapingReceipt> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        await page.goto(url, { timeout: 60000 });
        await page.waitForSelector(".ui-page.ui-page-theme-a.ui-page-active");

        if (!(await page.$('.avisoErro') == null)) {
            const error = await page.$eval('.avisoErro', divs => (divs as HTMLElement).innerText)
            await browser.close();
            return { error }
        }

        await page.$('.txtTopo')
        const emitter = await page.$eval('.txtTopo', div => (div as HTMLElement).innerText.trim())
        const amount = await page.$eval('.totalNumb.txtMax', div => (div as HTMLElement).innerText.trim())
        const generalInfos = await page.$eval(
            '#infos > div:nth-child(1) > div > ul > li', div => (div as HTMLElement).innerText.trim())
        const keyLine = await page.$eval('.chave', div => (div as HTMLElement).innerText.trim())

        const receiptKey = keyLine.replace(/\D+/g, '');
        const totalAmount = Number(amount.replace(',', '.'))

        const screenshot = await page.screenshot({ fullPage: true })

        await browser.close();
        return { emitter, totalAmount, generalInfos, receiptKey, screenshot }
    }


}
export default ReceiptService;