document.addEventListener("DOMContentLoaded", () => {
    const socket = io(); // Initialize Socket.IO client
    const chatWindow = document.getElementById("chat-window");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    const appendMessage = (message, sender) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", sender);
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
    };

    sendButton.addEventListener("click", () => {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        // Append user message
        appendMessage(userMessage, "user");

        // Send message to the server
        socket.emit("send_message", { message: userMessage });
        userInput.value = "";
    });

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });

    // Listen for messages from the server
    socket.on("receive_message", (data) => {
        appendMessage(data.message, data.sender === "ai" ? "ai" : "system");
    });
});
