import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferModule } from './transfer/transfer.module';
import { EthTrackingModule } from './eth-tracking/eth-tracking.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TransferModule, EthTrackingModule, ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'admin',
      password: process.env.DATABASE_PASSWORD || 'admin',
      database: process.env.DATABASE_NAME || 'eth_track',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      "logging": true,
    }),
    AuthModule
  ],
})
export class AppModule { }
