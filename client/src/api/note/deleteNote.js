import { url } from '../../utils/url';

export const deleteNote = async (id) => {
	try {
		await fetch(`${url}/notes/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
			},
		});
		return {
			data: 'Notita stearsa cu succes',
		};
	} catch (error) {
		return {
			error: error.message,
		};
	}
};
