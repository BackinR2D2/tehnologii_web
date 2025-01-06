import { url } from '../../utils/url';

export const addNote = async (data) => {
	try {
		const response = await fetch(`${url}/api/notes`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
			},
			body: JSON.stringify(data),
		});
		const res = await response.json();
		if (res.error) {
			return { error: res.error };
		}
		return { message: res.message };
	} catch (error) {
		return { error: error.message };
	}
};
