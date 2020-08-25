import express from 'express';
import routes from './routes';

import 'reflect-metadata';
import './database';

const PORT = 3333;
const app = express();

app.use(express.json());
app.use('', routes);

app.listen(PORT, () => {
  console.log(`[APP] running ON :${PORT}`);
});