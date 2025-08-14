const myName = "sudharsan"; // change to your Instagram display name

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            renderChat(data);
        } catch (err) {
            alert("Invalid JSON file");
            console.error(err);
        }
    };
    reader.readAsText(file);
});

function renderChat(data) {
    const container = document.getElementById('chatContainer');
    container.innerHTML = "";

    const messages = data.messages || [];
    messages.reverse().forEach(msg => {
        if (!msg.content && !msg.photos && !msg.videos) return;

        const div = document.createElement('div');
        div.classList.add('message');

        if (msg.sender_name === myName) {
            div.classList.add('me');
        } else {
            div.classList.add('them');
        }

        // Add text
        if (msg.content) {
            div.innerHTML += `<div>${msg.content}</div>`;
        }

        // Add photos
        if (msg.photos) {
            msg.photos.forEach(photo => {
                div.innerHTML += `<a href="${photo.uri}" target="_blank">
                    <img src="${photo.uri}" alt="photo">
                </a>`;
            });
        }

        // Add videos
        if (msg.videos) {
            msg.videos.forEach(video => {
                div.innerHTML += `<a href="${video.uri}" target="_blank">📹 Video</a>`;
            });
        }

        // Timestamp
        div.innerHTML += `<div class="timestamp">${new Date(msg.timestamp_ms).toLocaleString()}</div>`;

        container.appendChild(div);
    });
}
