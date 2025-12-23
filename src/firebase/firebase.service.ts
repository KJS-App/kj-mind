import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (admin.apps.length) {
      this.logger.log('Firebase already initialized');
      return;
    }

    const credentialsPath = this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS');
    
    if (!credentialsPath) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
    }

    const resolvedPath = path.resolve(credentialsPath);
    
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Firebase service account file not found at: ${resolvedPath}`);
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(resolvedPath, 'utf8'),
    ) as admin.ServiceAccount;

    const projectId =
      this.configService.get<string>('FIREBASE_PROJECT_ID') ||
      serviceAccount.projectId;

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId,
      });

      this.logger.log('Firebase initialized with service account.');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase:', error);
      throw error;
    }
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return this.getAuth().verifyIdToken(idToken);
  }

  getProjectId(): string | undefined {
    return this.configService.get<string>('FIREBASE_PROJECT_ID');
  }

  getAppClaimConfig(): { key: string; value: string } | null {
    const key = this.configService.get<string>('FIREBASE_REQUIRE_APP_CLAIM');
    const value = this.configService.get<string>('FIREBASE_APP_CLAIM_VALUE');

    return key && value ? { key, value } : null;
  }
   getFirestore(): admin.firestore.Firestore {
    return admin.firestore();
  }

}