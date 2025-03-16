document.querySelector('.form').addEventListener('submit', function (e) {
	e.preventDefault();

	var formData = new FormData(this);
	fetch('https://formspree.io/f/movevelz', {
		method: 'POST',
		body: formData
	})
		.then(response => response.json())
		.then(data => {
			document.getElementById('success-message').style.display = 'block';
			document.getElementById('error-message').style.display = 'none';
			this.reset();
		})
		.catch(error => {
			document.getElementById('error-message').style.display = 'block';
			document.getElementById('success-message').style.display = 'none';
		});
});