import express from 'express';
import { auth } from '../middlewares/auth.js';
import Note from '../models/note.model.js';
import { Op } from 'sequelize';

const router = express.Router();

// get all notes
router.get('/notes/all', auth, async (_, res) => {
	try {
		const notes = await Note.findAll();
		return res.status(200).json(notes);
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// get note by id
router.get('/notes/:id', auth, async (req, res) => {
	const { id } = req.params;
	const student_id = req.student_id;
	try {
		const note = await Note.findOne({ where: { id, student_id } });
		if (!note) {
			return res.status(404).json({ error: 'Note not found' });
		}
		return res.status(200).json(note);
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// create note
router.post('/notes', auth, async (req, res) => {
	const student_id = req.student_id;
	const { content, materie, tag } = req.body;
	if (!student_id || !content) {
		return res.status(400).json({ error: 'Invalid Request' });
	}
	try {
		const note = await Note.create({ student_id, content, materie, tag });
		return res.status(201).json(note);
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// update note
router.put('/notes/:id', auth, async (req, res) => {
	const { id } = req.params;
	const student_id = req.student_id;
	const { content, materie, tag } = req.body;
	if (!student_id || !content) {
		return res.status(400).json({ error: 'Invalid Request' });
	}
	try {
		const note = await Note.findOne({ where: { id, student_id } });
		if (!note) {
			return res.status(404).json({ error: 'Note not found' });
		}
		await note.update({ content, materie, tag });
		return res.status(200).json(note);
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// delete note
router.delete('/notes/:id', auth, async (req, res) => {
	const { id } = req.params;
	const student_id = req.student_id;
	try {
		const note = await Note.findOne({ where: { id, student_id } });
		if (!note) {
			return res.status(404).json({ error: 'Note not found' });
		}
		await note.destroy();
		return res.status(204).json({ data: 'Note deleted' });
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// get notes filter by tag, materie or search query for content received in query params
router.get('/notes', auth, async (req, res) => {
	const student_id = req.student_id;
	const { tag, materie, search } = req.query;
	console.log(tag, materie, search);
	const orParams = [];
	if (tag !== 'undefined' && tag !== 'null') {
		orParams.push({ tag });
	}
	if (materie !== 'undefined' && materie !== 'null') {
		orParams.push({ materie });
	}
	if (search !== 'undefined' && search !== 'null' && search !== '') {
		orParams.push({ content: { [Op.like]: `%${search}%` } });
	}

	const where = {
		student_id,
	};

	if (orParams.length > 0) {
		where[Op.and] = orParams;
	}

	try {
		const notes = await Note.findAll({
			where,
		});
		return res.status(200).json(notes);
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
