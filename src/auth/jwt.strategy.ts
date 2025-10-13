import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { ErrorMessage } from './constants/auth.enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error(ErrorMessage.JwtSecretMissing);
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request: Request) => (request?.headers?.['x-access-token'] as string) || null,
                (request: Request) => request?.cookies?.['access_token'] || null,
            ]),
            secretOrKey: secret,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
