import express from 'express';
import { ENV } from '../config/env.js';
import path from 'path';
import { connectionDB } from '../config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { functions, inngest } from '../config/innges.js';

const app = express();
const __dirname = path.resolve();
//clerk
app.use(clerkMiddleware());

app.use(express.json());

app.use('api/inngest', serve({ client: inngest, functions }));

app.get('/api', (req, res) => {
  res.status(200).send('Welcome CyberCart');
});

const startServer = async () => {
  await connectionDB();
  app.listen(ENV.PORT, () => {
    console.log('Server Successfully start');
  });
};
startServer();
