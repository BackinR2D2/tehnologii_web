import { url } from '../utils/url';

export const login = async (email, password) => {
	try {
		const response = await fetch(`${url}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});
		const data = await response.json();
		if (data.error) {
			return { error: data.error };
		}
		return { token: data.token };
	} catch (error) {
		return { error: error.message };
	}
};
