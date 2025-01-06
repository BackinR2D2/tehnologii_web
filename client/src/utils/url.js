export let url = '';
if (import.meta.env.MODE === 'development') {
	url = 'http://localhost:5000/api';
} else {
	url = 'https://tehnologii-web.onrender.com/api';
}
console.log(url, import.meta.env);
