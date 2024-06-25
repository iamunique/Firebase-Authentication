import * as admin from 'firebase-admin';
import serviceAccount from '../fir-authentication-fe7ef-firebase-adminsdk-947zn-6dc2163620.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export const auth = admin.auth();
