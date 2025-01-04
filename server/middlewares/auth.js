import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.student_id = decoded.id;
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
};