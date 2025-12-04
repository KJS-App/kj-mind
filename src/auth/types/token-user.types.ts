
export interface FirebaseIdentities {
  email?: string[];
  [key: string]: any; // for other providers like phone, google, etc.
}

export interface FirebaseInfo {
  identities: FirebaseIdentities;
  sign_in_provider: string;
}

export interface DecodedFirebaseToken {
  name?: string;
  iss: string;               // issuer
  aud: string;               // audience (project ID)
  auth_time: number;         // auth time in seconds
  user_id: string;           // Firebase UID
  sub: string;               // same as user_id
  iat: number;               // issued at timestamp
  exp: number;               // expiration timestamp
  email?: string;
  email_verified?: boolean;
  firebase: FirebaseInfo;
  [key: string]: any;        // for any custom claims you add
}

// Admin token payload received from frontend
export interface AdminTokenPayload {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  exp: number;
  iat: number;
  firebaseIdToken: string;
}

// Validated admin user returned after authentication
export interface ValidatedAdminUser {
  name: string;
  email: string;
  role: string;
  firebaseUid: string;
  firebaseEmail?: string;
  emailVerified?: boolean;
}


