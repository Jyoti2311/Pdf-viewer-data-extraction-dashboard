import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import uploadRoute from './routes/upload';
import extractRoute from './routes/extract';
import invoicesRoute from './routes/invoices';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/upload', uploadRoute);
app.use('/extract', extractRoute);
app.use('/invoices', invoicesRoute);

const port = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to connect to DB:', err);
});
