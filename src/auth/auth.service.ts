import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthService {
    constructor(private readonly firebaseService: FirebaseService) { }

    async generateSsoToken(uid: string): Promise<string> {
        const auth = this.firebaseService.getAuth();
        return auth.createCustomToken(uid);
    }
}
