let allMessages = [];
const myName = "sudharsan"; // change to your Instagram display name

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            allMessages = data.messages || [];
            allMessages.reverse();
            applyFilters();
        } catch (err) {
            alert("Invalid JSON file");
            console.error(err);
        }
    };
    reader.readAsText(file);
});

document.getElementById('dateFilter').addEventListener('change', applyFilters);
document.getElementById('timeFilter').addEventListener('change', applyFilters);
document.getElementById('searchInput').addEventListener('input', applyFilters);

function applyFilters() {
    const dateValue = document.getElementById('dateFilter').value;
    const timeValue = document.getElementById('timeFilter').value;
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    let filtered = allMessages;

    // Date filter
    if (dateValue) {
        const selectedDate = new Date(dateValue);
        filtered = filtered.filter(msg => {
            const msgDate = new Date(msg.timestamp_ms);
            return msgDate.getFullYear() === selectedDate.getFullYear() &&
                   msgDate.getMonth() === selectedDate.getMonth() &&
                   msgDate.getDate() === selectedDate.getDate();
        });
    }

    // Time filter (only if date is also selected)
    if (timeValue && dateValue) {
        const [hours, minutes] = timeValue.split(':').map(Number);
        filtered = filtered.filter(msg => {
            const msgDate = new Date(msg.timestamp_ms);
            return msgDate.getHours() === hours && msgDate.getMinutes() === minutes;
        });
    }

    // Search filter
    if (searchValue) {
        filtered = filtered.filter(msg => msg.content && msg.content.toLowerCase().includes(searchValue));
    }

    renderChat(filtered);
}

function renderChat(messages) {
    const container = document.getElementById('chatContainer');
    container.innerHTML = "";

    messages.forEach(msg => {
        if (!msg.content && !msg.photos && !msg.videos) return;

        const div = document.createElement('div');
        div.classList.add('message');

        if (msg.sender_name === myName) {
            div.classList.add('me');
        } else {
            div.classList.add('them');
        }

        // Text with emoji-safe rendering
        if (msg.content) {
            const textDiv = document.createElement('div');
            textDiv.textContent = msg.content; // preserves emoji
            div.appendChild(textDiv);
        }

        // Photos
        if (msg.photos) {
            msg.photos.forEach(photo => {
                const link = document.createElement('a');
                link.href = photo.uri;
                link.target = "_blank";

                const img = document.createElement('img');
                img.src = photo.uri;
                img.alt = "photo";

                link.appendChild(img);
                div.appendChild(link);
            });
        }

        // Videos
        if (msg.videos) {
            msg.videos.forEach(video => {
                const link = document.createElement('a');
                link.href = video.uri;
                link.target = "_blank";
                link.textContent = "📹 Video";
                div.appendChild(link);
            });
        }

        // Timestamp
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('timestamp');
        timeDiv.textContent = new Date(msg.timestamp_ms).toLocaleString();
        div.appendChild(timeDiv);

        container.appendChild(div);
    });
}

