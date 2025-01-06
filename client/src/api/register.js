import { url } from '../utils/url';

export const register = async (data) => {
	try {
		const response = await fetch(`${url}/api/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		const res = await response.json();
		if (res.error) {
			return { error: res.error };
		}
		return { token: res.token };
	} catch (error) {
		return { error: error.message };
	}
};
