document.querySelector('.form').addEventListener('submit', async function (e) {
	e.preventDefault();

	const formData = new FormData(this);
	const response = await fetch('https://formspree.io/f/movevelz', {
		method: 'POST',
		body: formData
	});

	if (response.status !== 200) {
		const error = await response.json();
		console.error(error);
		document.getElementById('error-message').style.display = 'block';
		document.getElementById('success-message').style.display = 'none';
	}

	console.log('????');
	document.getElementById('success-message').style.display = 'block';
	document.getElementById('error-message').style.display = 'none';
	this.reset();
});