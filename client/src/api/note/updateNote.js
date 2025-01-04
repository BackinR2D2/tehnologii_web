import { url } from '../../utils/url';

export const updateNote = async (id, content, materie, tag) => {
	try {
		const response = await fetch(`${url}/notes/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
			},
			body: JSON.stringify({
				content,
				materie,
				tag,
			}),
		});
		const note = await response.json();
		return {
			data: note,
		};
	} catch (error) {
		return {
			error: error.message,
		};
	}
};
