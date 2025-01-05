import express from 'express';
import { auth } from '../middlewares/auth.js';
import Note from '../models/note.model.js';
import NoteAccess from '../models/note_access.model.js';
import Student from '../models/student.model.js';
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
		// get note for student that is invited to the note
		const noteAccess = await NoteAccess.findOne({
			where: { member_id: student_id, note_id: id },
		});
		if (noteAccess) {
			const note = await Note.findOne({ where: { id } });
			const teamMembers = await NoteAccess.findAll({
				where: { note_id: note.id },
			});
			const teamMembersEmail = await Promise.all(
				teamMembers.map(async (member) => {
					const student = await Student.findOne({
						where: { id: member.member_id },
					});
					return student.email;
				})
			);
			return res
				.status(200)
				.json({ ...note.toJSON(), members: teamMembersEmail });
		}
		const note = await Note.findOne({ where: { id, student_id } });
		if (!note) {
			return res.status(404).json({ error: 'Note not found' });
		}
		const teamMembers = await NoteAccess.findAll({
			where: { note_id: note.id },
		});
		// return the email address of team members
		const teamMembersEmail = await Promise.all(
			teamMembers.map(async (member) => {
				const student = await Student.findOne({
					where: { id: member.member_id },
				});
				return student.email;
			})
		);
		return res
			.status(200)
			.json({ ...note.toJSON(), members: teamMembersEmail });
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// create note
router.post('/notes', auth, async (req, res) => {
	const student_id = req.student_id;
	const { content, materie, tag, teamMembers } = req.body;
	if (!student_id || !content) {
		return res.status(400).json({ error: 'Invalid Request' });
	}
	try {
		const author = await Student.findOne({ where: { id: student_id } });
		const note = await Note.create({
			student_id,
			content,
			materie,
			tag,
			author: author?.email ?? '',
		});
		if (teamMembers) {
			teamMembers.forEach(async (memberEmail) => {
				const member_id = await Student.findOne({
					where: { email: memberEmail },
				});
				await NoteAccess.create({
					author_id: student_id,
					note_id: note.id,
					member_id: member_id.id,
				});
			});
		}
		return res.status(201).json(note);
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

// update note
router.put('/notes/:id', auth, async (req, res) => {
	const { id } = req.params;
	const student_id = req.student_id;
	const { content, materie, tag, teamMembers } = req.body;
	if (!student_id || !content) {
		return res.status(400).json({ error: 'Invalid Request' });
	}
	try {
		// let student that has access to note to update it but also let the author to update it
		const noteAccess = await NoteAccess.findOne({
			where: { member_id: student_id, note_id: id },
		});
		if (!noteAccess) {
			const note = await Note.findOne({ where: { id, student_id } });
			if (!note) {
				return res.status(404).json({ error: 'Note not found' });
			}
		}
		const note = await Note.findOne({ where: { id } });
		if (!note) {
			return res.status(404).json({ error: 'Note not found' });
		}
		await note.update({ content, materie, tag });
		if (teamMembers) {
			// update the new team members in the note_access table (delete the old ones and add the new ones)
			await NoteAccess.destroy({ where: { note_id: note.id } });
			teamMembers.forEach(async (memberEmail) => {
				const member_id = await Student.findOne({
					where: { email: memberEmail },
				});
				await NoteAccess.create({
					author_id: student_id,
					note_id: note.id,
					member_id: member_id.id,
				});
			});
		}
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
		// let student that has access to note to delete it but also let the author to delete it
		const noteAccess = await NoteAccess.findOne({
			where: { member_id: student_id, note_id: id },
		});
		if (!noteAccess) {
			const note = await Note.findOne({ where: { id, student_id } });
			if (!note) {
				return res.status(404).json({ error: 'Note not found' });
			}
		}
		const note = await Note.findOne({ where: { id } });
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
	const { tag, materie, search, authorFilter } = req.query;
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
	if (
		authorFilter !== 'undefined' &&
		authorFilter !== 'null' &&
		authorFilter !== ''
	) {
		orParams.push({ author: authorFilter });
	}

	const where = {
		student_id,
	};

	if (orParams.length > 0) {
		where[Op.and] = orParams;
	}

	try {
		const notes = [];
		const notesQuery = await Note.findAll({
			where,
		});
		notes.push(...notesQuery);
		// find notes shared with student
		const sharedNotesQuery = await NoteAccess.findAll({
			where: { member_id: student_id },
		});
		const sharedNotes = await Promise.all(
			sharedNotesQuery.map(async (note) => {
				const where = {
					id: note.note_id,
				};
				if (
					orParams.length > 0 &&
					orParams[0].content !== undefined &&
					orParams[0].content !== null
				) {
					where[Op.and] = orParams;
				}
				const noteData = await Note.findOne({ where });
				return noteData;
			})
		);
		notes.push(...sharedNotes);
		const filteredNotes = notes.filter((e) => e);
		return res.status(200).json(filteredNotes);
	} catch (error) {
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

export default router;
