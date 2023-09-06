import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './auth.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [AuthStrategy],
})
export class AuthModule {}