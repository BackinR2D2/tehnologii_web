import db from '../models/index.js';
import { DataTypes } from 'sequelize';

const NoteAccess = db.define('note_access', {
	author_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	note_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	member_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

export default NoteAccess;
