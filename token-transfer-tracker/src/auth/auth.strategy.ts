import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(AuthStrategy.name);

    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            passReqToCallback: true
        });
    }

    public validate = async (req, username, password): Promise<boolean> => {
        if (
            this.configService.get<string>('BASIC_AUTH_ID') === username &&
            this.configService.get<string>('BASIC_AUTH_SECRET') === password
        ) {
            return true;
        }
        this.logger.error(`Unauthorized request`);
        
        throw new UnauthorizedException();
    }
}