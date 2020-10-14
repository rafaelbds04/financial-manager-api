import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as moment from 'moment';
import * as puppeteer from 'puppeteer'
import AttachmentService from "src/attachments/attachment.service";
import { Receipt } from "./receipt.interface";

interface SrapingReceipt {
    error?: string;
    emitter?: string;
    totalAmount?: number;
    generalInfos?: string;
    screenshot?: Buffer;
}



@Injectable()
class ReceiptService {

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
                const scrapingResult = await this.scrapingReceipt(receiptCode);

                if (scrapingResult.error) {
                    if (emittedOffline) {
                        return {
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
                const emittedDate = moment(unformattedDate, "DD/MM/YYYY hh:mm:ss").utcOffset(-180).toISOString();

                //Adding fiscal note do attachment
                const screenshot = await this.attachmentService.createAttachment(scrapingResult.screenshot);

                delete scrapingResult.screenshot;
                delete scrapingResult.generalInfos;
                return { ...scrapingResult, attachment: screenshot, emittedDate }

            } catch (error) {
                console.log(error)
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new HttpException('Wrong code provided', HttpStatus.BAD_REQUEST)
        }


    }

    public async scrapingReceipt(url: string): Promise<SrapingReceipt> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});
        await page.waitForFunction('document.getElementsByClassName("linhaShade")');

        if (!(await page.$('.avisoErro') == null)) {
            const error = await page.$eval('.avisoErro', divs => (divs as HTMLElement).innerText)
            await browser.close();
            return { error }
        } 

        const screenshot = await page.screenshot({fullPage: true})

        const emitter = await page.$eval('.txtTopo', div => (div as HTMLElement).innerText)
        const amount = await page.$eval('.totalNumb.txtMax', div => (div as HTMLElement).innerText)
        const generalInfos = await page.$eval(
            '#infos > div:nth-child(1) > div > ul > li', div => (div as HTMLElement).innerText)

        const totalAmount = Number(amount.replace(',', '.'))

        await browser.close();
        return { emitter, totalAmount, generalInfos, screenshot }
    }


}
export default ReceiptService;