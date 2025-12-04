import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { FirebaseService } from '../../firebase/firebase.service';
import { DecodedFirebaseToken } from '../types/token-user.types';
import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
    constructor(private readonly firebaseService: FirebaseService) {
        super();
    }

    async validate(req: Request): Promise<any> {
        const authHeader = req.headers?.authorization || req.headers?.Authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }

        const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;

        if (!header.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid Authorization header');
        }
        const idToken = header.substring(7);


        try {
            const decodedToken = await this.firebaseService.verifyIdToken(idToken);

            const appClaimConfig = this.firebaseService.getAppClaimConfig();
            if (appClaimConfig) {
                const actual = (decodedToken as any)[appClaimConfig.key];
                if (actual !== appClaimConfig.value) {
                    throw new ForbiddenException('Token not valid for this client app');
                }
            }

            return decodedToken;
        } catch (err) {
            if (err instanceof UnauthorizedException || err instanceof ForbiddenException) {
                throw err;
            }
            throw new UnauthorizedException('Invalid or expired Firebase ID token');
        }
    }
}
