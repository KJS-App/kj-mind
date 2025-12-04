import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { FirebaseService } from '../../firebase/firebase.service';
import { jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';
import { AdminTokenPayload, ValidatedAdminUser } from '../types/token-user.types';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    async validate(req: Request): Promise<ValidatedAdminUser> {
        const authHeader = req.headers?.authorization || req.headers?.Authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }

        const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;

        if (!header.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid Authorization header');
        }
        const token = header.substring(7);

        try {
            // Step 1: Verify the outer JWT token
            const key = this.configService.get<string>('NEXT_PUBLIC_JWT_SECRET');
            if (!key) {
                throw new UnauthorizedException('JWT secret not configured');
            }

            const secret = new TextEncoder().encode(key);
            const { payload } = await jwtVerify(token, secret);

            const tokenPayload = payload as unknown as AdminTokenPayload;

            // Step 2: Validate required fields in the outer token
            if (!tokenPayload.email || !tokenPayload.role || !tokenPayload.firebaseIdToken) {
                throw new UnauthorizedException('Invalid token payload structure');
            }

            // Step 3: Check if user has ADMIN role
            if (tokenPayload.role !== 'ADMIN') {
                throw new ForbiddenException('Access denied. Admin role required');
            }

            // Step 4: Verify the Firebase ID token embedded in the outer token
            const decodedFirebaseToken = await this.firebaseService.verifyIdToken(
                tokenPayload.firebaseIdToken,
            );

            // Step 5: Validate app claim if configured
            const appClaimConfig = this.firebaseService.getAppClaimConfig();
            if (appClaimConfig) {
                const actual = (decodedFirebaseToken as any)[appClaimConfig.key];
                if (actual !== appClaimConfig.value) {
                    throw new ForbiddenException('Token not valid for this client app');
                }
            }

            // Step 6: Optionally verify that the email in outer token matches Firebase token
            if (decodedFirebaseToken.email && tokenPayload.email !== decodedFirebaseToken.email) {
                throw new UnauthorizedException('Token email mismatch');
            }

            // Return validated admin user with combined information
            return {
                name: tokenPayload.name,
                email: tokenPayload.email,
                role: tokenPayload.role,
                firebaseUid: decodedFirebaseToken.uid,
                firebaseEmail: decodedFirebaseToken.email,
                emailVerified: decodedFirebaseToken.email_verified,
            };
        } catch (err) {
            if (err instanceof UnauthorizedException || err instanceof ForbiddenException) {
                throw err;
            }
            // Log the error for debugging (optional)
            console.error('Admin authentication error:', err);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
