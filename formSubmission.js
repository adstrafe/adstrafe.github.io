document.querySelector('.form').addEventListener('submit', async function (e) {
	e.preventDefault();

	const formData = new FormData(this);
	try {
		const response = await fetch('https://formspree.io/f/movevelz', {
			method: 'POST',
			body: formData,
			headers: { 'Accept': 'application/json' }
		});

		if (!response.ok) {
			showMessage('Error sending email. Please try contacting me directly.');
		}
		else {
			showMessage('Thank you for your message.');
		}

		this.reset();
	} catch (err) {
		showMessage('Network error. Please check your connection.');
	}
});

function showMessage(message) {
	const messageDiv = document.getElementById('form-fetch-message');
	messageDiv.textContent = message;
	messageDiv.style.opacity = '1';

	setTimeout(() => {
		messageDiv.style.opacity = '0';
	}, 3000);
}