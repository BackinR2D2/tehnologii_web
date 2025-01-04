import { url } from '../../utils/url';

export const getNotes = async (tag, materie, search) => {
	try {
		const response = await fetch(
			`${url}/notes?tag=${tag}&materie=${materie}&search=${search}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				},
			}
		);
		const notes = await response.json();
		return { data: notes };
	} catch (error) {
		return { error: error.message };
	}
};
