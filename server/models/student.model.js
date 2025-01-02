import db from '../models/index.js';
import { DataTypes } from 'sequelize';

const Student = db.define('student', {
	email: DataTypes.TEXT,
	password: DataTypes.TEXT,
});

export default Student;
