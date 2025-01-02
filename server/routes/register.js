import express from 'express';
import bcrypt from 'bcrypt';
import Student from '../models/student.model.js';

const router = express.Router();

// register endpoint
router.post('/register', async (req, res) => {
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
		if (student) {
			return res.status(400).json({ error: 'User already exists' });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		await Student.create({ email, password: hashedPassword });
		return res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
