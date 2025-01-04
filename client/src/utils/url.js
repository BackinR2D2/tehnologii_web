export const url =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:5000/api'
		: 'https://ase-student-portal.herokuapp.com';
