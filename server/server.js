import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import routes
import loginRoute from './routes/login.js';
import registerRoute from './routes/register.js';
import db from './models/index.js';
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
	res.send('Server Initialised');
});

// routes
app.use('/api', loginRoute);
app.use('/api', registerRoute);

app.use('*', (_, res) => {
	res.status(404).json({ error: 'Route Not Found.' });
});

app.listen(PORT, () => {
	db.sync();
	console.log(`Server is running on port ${PORT}`);
});
