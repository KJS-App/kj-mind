import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UserType } from './enums/user.enums';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async updateUserType(userId: string, userType: UserType): Promise<void> {
    const firestore = this.firebaseService.getFirestore();
    const userRef = firestore.collection('users').doc(userId);

    await userRef.update({
      userType,
      updatedAt: new Date().toISOString(),
    });
  }
}
