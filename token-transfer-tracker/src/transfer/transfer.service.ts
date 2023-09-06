import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from './transfer.entity';

@Injectable()
export class TransferService {
    private readonly logger = new Logger(TransferService.name);
    constructor(
        @InjectRepository(Transfer)
        private transferRepository: Repository<Transfer>,
    ) { }

    async createTransfer(fromAddress: string, toAddress: string, value: string, txid: string) {
        const transfer = this.transferRepository.create({
            fromAddress,
            toAddress,
            value,
            txid,
        });
        await this.transferRepository.save(transfer);
    }

    async getTopSpendingAddresses(limit: number): Promise<any[]> {
        try {
            const topAddresses = await this.transferRepository
                .createQueryBuilder('transfer')
                .select('SUM(CAST(transfer.value AS NUMERIC)) as totalSpent, "fromAddress"')
                .where('transfer.createdAt >= :date', { date: new Date(Date.now() - 24 * 60 * 60 * 1000) })
                .where('transfer.hasBlacklistAddress = false')
                .groupBy('transfer.fromAddress')
                .orderBy('totalSpent', 'DESC')
                .limit(limit)
                .getRawMany();
            return topAddresses;
        } catch (e: any) {
            this.logger.error(`Error when getting top spending address: ${e}`)
            throw new HttpException('Error when getting top spending address', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return [];
    }

    async blacklistTransfers(address: string): Promise<boolean> {
        try {
            await this.transferRepository
                .createQueryBuilder()
                .update(Transfer)
                .set({ hasBlacklistAddress: true })
                .where('fromAddress = :address OR toAddress = :address', { address })
                .execute();
        } catch (e: any) {
            this.logger.error(`Error when blacklisting address: ${e}`)
            return false
        }

        return true
    }
}