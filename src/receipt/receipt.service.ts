import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import * as moment from 'moment-timezone';
import * as puppeteer from 'puppeteer'
import AttachmentService from "src/attachments/attachment.service";
import { Receipt } from "./receipt.interface";

interface SrapingReceipt {
    error?: string;
    emitter?: string;
    totalAmount?: number;
    emittedDate?: string;
    screenshot?: Buffer;
    receiptKey?: string,
    cnpj?: string
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
                const url = new URL(receiptCode.replace(' ', ''));
                const params = url.searchParams.get('p') && url.searchParams.get('p').split('|');
                const emittedOffline = ((params && params.length > 5) || url.searchParams.get('vNF')) ? true : false

                const scrapingResult = await this.scrapingReceipt(url.toString());

                if (scrapingResult.error) {
                    if (emittedOffline) {
                        return {
                            receiptKey: url.searchParams.get('chNFe') || params[0],
                            totalAmount: Number(url.searchParams.get('vNF')) || Number(params[4]),
                            error: scrapingResult.error
                        }
                    }
                    throw new HttpException(scrapingResult.error, HttpStatus.INTERNAL_SERVER_ERROR)
                }

                const { screenshot, ...latScrapingResult } = scrapingResult

                //Adding fiscal note do attachment 
                const attachment = await this.attachmentService.createAttachment(screenshot);
                return { ...latScrapingResult, attachment }

            } catch (error) {
                if (error?.name === 'TimeoutError') throw new HttpException('Erro tempo limite excedido', HttpStatus.REQUEST_TIMEOUT);
                this.logger.error((typeof error == 'object' ? JSON.stringify(error.message) : error.message));
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
        const receiptKey = await page.$eval('.chave', div => (div as HTMLElement).innerText.trim().replace(/\D+/g, ''))
        const cnpj = await page.$eval('#conteudo > div.txtCenter > div:nth-child(2)', div => (div as HTMLElement).innerText.trim().replace(/\D/g, ''))
        const screenshot = await page.screenshot({ fullPage: true })
        await browser.close();

        const totalAmount = Number(amount.replace(',', '.'))
        const noteInformations = generalInfos.split(' ');
        const emissaoIndex = noteInformations.indexOf('Emissão:')

        //Get next 2 index in the array, there is a date.
        const unformattedDate = noteInformations[emissaoIndex + 1] + ' ' + noteInformations[emissaoIndex + 2]
        const emittedDate = moment.tz(unformattedDate, "DD/MM/YYYY hh:mm:ss", 'America/Sao_Paulo').utc().toISOString();

        return { emitter, totalAmount, emittedDate, receiptKey, cnpj, screenshot }
    }

}
export default ReceiptService;