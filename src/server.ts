import 'dotenv/config';
import express from 'express';

import { setupMongo } from './database';
import { routes } from './routes';

const app = express();

setupMongo()
    .then(() => {
        app.use(express.json());
        app.use(routes);

        app.listen(4000, () => {
            console.log('🚀 Server started on port 4000! 🖥️');
        });
    })
    .catch((err) => {
        console.error(err.message);
    });
