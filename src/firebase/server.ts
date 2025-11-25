
import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

interface FirebaseAdminServices {
  app: App;
  auth: Auth;
  firestore: Firestore;
}

function getFirebaseAdmin(): FirebaseAdminServices {
  if (getApps().length > 0) {
    const app = getApp();
    return {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
    };
  }

  const app = initializeApp({
    credential: credential.applicationDefault(),
  });

  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}

export { getFirebaseAdmin };
