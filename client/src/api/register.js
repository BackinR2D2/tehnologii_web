export const register = async (data) => {
	try {
		const response = await fetch('http://localhost:5000/api/register', {
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
