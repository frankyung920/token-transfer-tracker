import { Injectable, Logger } from '@nestjs/common';
import { TransferService } from '../transfer/transfer.service';
import Web3 from 'web3';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthTrackingService {
    private readonly logger = new Logger(EthTrackingService.name);

    constructor(
        private readonly transferService: TransferService,
        private readonly configService: ConfigService
    ) { }

    async trackTransfers() {
        const abi = fs.readFileSync(path.join(__dirname, 'dai-abi.json'), 'utf8');
        const web3 = new Web3(new Web3.providers.WebsocketProvider(`wss://mainnet.infura.io/ws/v3/${this.configService.get<string>('INFURA_API_KEY')}`));
        const tokenContract = new web3.eth.Contract(JSON.parse(abi), this.configService.get<string>('DAI_TOKEN_ADDRESS'));

        const options = {
            reconnect: {
                auto: true,
                delay: 5000,
                maxAttempts: 5,
                onTimeout: false
            },
            address: this.configService.get<string>('DAI_TOKEN_ADDRESS'),
            topics: [
                this.configService.get<string>('DAI_TRANSFER_EVENT_SIGNATURE')
            ]
        };
        const subscription = tokenContract.events.Transfer(options);
        const inputs = JSON.parse(abi).find(e => e.type === 'event' && e.name === 'Transfer').inputs;

        subscription
            .on('data',  event => {
                let tx = web3.eth.abi.decodeLog(inputs,
                    event.data,
                    event.topics
                );
                const to = tx.dst + '';
                const from = tx.src + '';
                const value = Web3.utils.fromWei(tx.wad.toString(), "ether");
                const txid = event.transactionHash;
                this.logger.log(`Transfer event - to address: ${to}, from address: ${from}, value: ${value}, txid: ${txid}`);
                this.transferService.createTransfer(from, to, value, txid);
            });

        subscription
            .on('error', err => {
                this.logger.error(`Error when subscribing to transfer event: ${err.stack}`)
            });

        subscription
            .on('connected', e => {
                this.logger.log(`Connected to subscription of event Transfer`)
            });

    }
}
