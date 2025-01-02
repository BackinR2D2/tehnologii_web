import express from 'express';
import bcrypt from 'bcrypt';
import Student from '../models/student.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// login endpoint
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: 'Invalid Request' });
	}
	if (email) {
		if (!email.includes('@stud.ase.ro')) {
			return res.status(400).json({ error: 'Invalid Email' });
		}
	}
	try {
		const student = await Student.findOne({ where: { email } });
		if (!student) {
			return res.status(404).json({ error: 'User not found' });
		}
		const validPassword = await bcrypt.compare(password, student?.password);
		if (!validPassword) {
			return res.status(401).json({ error: 'Invalid Password' });
		}
		// send jwt token
		const token = jwt.sign({ id: student?.id }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		});
		return res.status(200).json({ token });
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
