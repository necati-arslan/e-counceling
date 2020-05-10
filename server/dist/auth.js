"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require('firebase-admin');
const serviceAccountPath = `./service-accounts/${process.env.SERVICE_ACCOUNT_FILE_NAME}`;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    databaseURL: process.env.FIRESTORE_DATABASE_URL
});
exports.auth = admin.auth();
//# sourceMappingURL=auth.js.map