import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Stats from './stats.entity';
import TransactionService from '../transactions/transaction.service';
import { Cron } from "@nestjs/schedule";


@Injectable()
class StatsService {

    constructor(
        @InjectRepository(Stats) private statsRepository: Repository<Stats>,
        private readonly transactionService: TransactionService
    ) { }

    @Cron('60 * * * * *')
    async updateStats(): Promise<any> {
        try {
            const revenue = await this.transactionService.getTotalByTypeOfThisMonth('REVENUE');
            const expense = await this.transactionService.getTotalByTypeOfThisMonth('EXPENSE');
            const toDue = await this.transactionService.getTotalDue();
            const overDue = await this.transactionService.getTotalOverDue();
            
            const toUpdate = this.statsRepository.create({
                id: 1,
                expense: expense | 0,
                overDue: overDue | 0,
                due: toDue | 0,
                revenue: revenue| 0
            })

            const updated = await this.statsRepository.save(toUpdate);
            console.log('Stats updated!')
            return updated;

        } catch (error) {
            console.log(error);
        }
    }
    sleep(ms: number): any {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    async getAllStats(): Promise<Stats> {
        try {
            const stats = await this.statsRepository.find();
            await this.sleep(3000);
            return stats[0];
        } catch (error) {
            throw new HttpException('Something with that wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
export default StatsService;