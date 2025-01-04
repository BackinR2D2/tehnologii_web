export const addNote = async (data) => {
	try {
		const response = await fetch('http://localhost:5000/api/notes', {
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
