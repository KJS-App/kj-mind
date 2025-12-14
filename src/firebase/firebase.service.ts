import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

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

    const serviceAccount = {
      type: this.configService.get<string>('TYPE'),
      project_id: this.configService.get<string>('PROJECT_ID'),
      private_key_id: this.configService.get<string>('PRIVATE_KEY_ID'),
      private_key: this.configService
        .get<string>('PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'),
      client_email: this.configService.get<string>('CLIENT_EMAIL'),
      client_id: this.configService.get<string>('CLIENT_ID'),
      auth_uri: this.configService.get<string>('AUTH_URI'),
      token_uri: this.configService.get<string>('TOKEN_URI'),
      auth_provider_x509_cert_url: this.configService.get<string>(
        'AUTH_PROVIDER_X509_CERT_URL',
      ),
      client_x509_cert_url: this.configService.get<string>(
        'CLIENT_X509_CERT_URL',
      ),
      universe_domain: this.configService.get<string>('UNIVERSE_DOMAIN'),
    };

    const projectId =
      this.configService.get<string>('FIREBASE_PROJECT_ID') ||
      serviceAccount.project_id;

    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
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

  getFirestore(): admin.firestore.Firestore {
    return admin.firestore();
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
}
