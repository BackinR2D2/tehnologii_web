import { url } from '../../utils/url';

export const getNote = async (id) => {
	try {
		const response = await fetch(`${url}/notes/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
			},
		});
		const note = await response.json();
		return { data: note };
	} catch (error) {
		return { error: error.message };
	}
};
