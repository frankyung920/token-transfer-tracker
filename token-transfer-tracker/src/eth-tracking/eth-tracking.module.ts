import { Module, OnModuleInit } from '@nestjs/common';
import { EthTrackingService } from './eth-tracking.service';
import { TransferModule } from '../transfer/transfer.module';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [TransferModule, ConfigModule],
    providers: [EthTrackingService],
})
export class EthTrackingModule implements OnModuleInit {
    constructor(private readonly ethTrackingService: EthTrackingService) { }

    onModuleInit() {
        this.ethTrackingService.trackTransfers();
    }
}