import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({
  projectId: 'pubsub-websockets-a8ec6',
  keyFilename: './ServiceAccountKey.json',
});

export const tasksDB = db.collection('tasks')