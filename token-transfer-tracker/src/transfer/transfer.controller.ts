import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get('top-spending-addresses')
  async getTopSpendingAddresses() {
    const topAddresses = await this.transferService.getTopSpendingAddresses(10);
    return topAddresses;
  }

  @Post('blacklist')
  @UseGuards(AuthGuard('basic'))
  async blacklistAddress(@Body() body: { address: string }) {
    const success = await this.transferService.blacklistTransfers(body.address);
    if (!success) {
      return `Blacklist address failed!`;
    }
    return `Blacklist address successful`;
  }
}