const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatMessages = document.querySelector("#chatMessages");

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = chatInput.value;
    const messageElement = document.createElement("div");
    messageElement.innerHTML = message;
    chatMessages.appendChild(messageElement);
    chatInput.value = "";
});
