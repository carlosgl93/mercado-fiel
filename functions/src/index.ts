import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { api } from './functions/api';
// import { getAccessToken } from './utils/getAccessToken';

setGlobalOptions({ region: 'southamerica-west1', timeoutSeconds: 15 });
// const credential = applicationDefault();
// const token = getAccessToken(credential);
// Initialize Firebase Admin
const app = initializeApp({
  // credential: credential,
  storageBucket: 'mercado-fiel.appspot.com',
});

// Export the initialized services
export { api, app, getAuth, getFirestore, getStorage };
