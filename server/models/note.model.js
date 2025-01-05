import db from '../models/index.js';
import { DataTypes } from 'sequelize';

const Note = db.define('note', {
	student_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	content: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	author: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	materie: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	tag: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

export default Note;
