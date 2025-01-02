import { config } from 'dotenv';
config();
import { Sequelize } from 'sequelize';
const DB_URI = process.env.DB_URI;

const sequelize = new Sequelize(DB_URI, {
	dialect: 'postgres',
});

export default sequelize;
