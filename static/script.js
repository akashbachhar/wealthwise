document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('portfolio-form');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Show progress bar
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '0%';

        // Incrementally fill progress bar
        let progress = 0;
        const interval = setInterval(() => {
            progress = Math.min(progress + 10, 90);
            progressBar.style.width = progress + '%';
        }, 400);

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('/generate-prompt', {
                method: 'POST',
                body: new URLSearchParams(data),
            });
            clearInterval(interval);

            if (response.ok) {
                progressBar.style.width = '100%';
                const responseData = await response.json();

                localStorage.setItem('responseData', JSON.stringify(responseData));
                window.location.href = '/result-page';
            } else {
                alert('Error: ' + response.statusText);
            }
        } catch (error) {
            clearInterval(interval);
            alert('Error occurred while submitting the form.');
        } finally {
            // Hide progress bar after a delay
            setTimeout(() => {
                progressBarContainer.style.display = 'none';
            }, 500);
        }
    });
});