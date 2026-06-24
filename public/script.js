const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function addMessage(message, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.textContent = message;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, "user-message");
    userInput.value = "";

    const loadingMessage = document.createElement("div");
    loadingMessage.className = "bot-message";
    loadingMessage.textContent = "🚗 Auto AI is thinking...";

    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        console.log("Status:", response.status);

const text = await response.text();

console.log("Response:", text);

const data = JSON.parse(text);

        loadingMessage.remove();

        addMessage(
            data.reply || "No response received.",
            "bot-message"
        );

    } catch (error) {

        loadingMessage.remove();

        addMessage(
            "❌ Unable to connect to Auto AI server.",
            "bot-message"
        );

        console.error(error);
    }
}

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});