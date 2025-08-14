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
        }
    };
    reader.readAsText(file);
});

function renderChat(data) {
    const container = document.getElementById('chatContainer');
    container.innerHTML = "";

    // Instagram JSON export example:
    // data.messages = [{ sender_name: "...", content: "...", timestamp_ms: 123456789 }, ...]

    const messages = data.messages || [];

    messages.reverse().forEach(msg => {
        if (!msg.content) return; // skip empty messages

        const div = document.createElement('div');
        div.classList.add('message');

        // Change this to your username to mark "me" messages
        const myName = "Your Instagram Name Here";
        if (msg.sender_name === myName) {
            div.classList.add('me');
        } else {
            div.classList.add('them');
        }

        div.innerHTML = `
            ${msg.content}
            <div class="timestamp">${new Date(msg.timestamp_ms).toLocaleString()}</div>
        `;

        container.appendChild(div);
    });
}
