const backendAPI = 'http://localhost:3000';


/*window.addEventListener("DOMContentLoaded", async () => {

    try {
        const token = localStorage.getItem('token');

        const messagesData = await axios.get(`${backendAPI}/message/get-messages`, { headers: { "Authorization": token } })

        for (let i = 0; i < messagesData.data.messages.length; i++) {
            showMessagesToUI(messagesData.data.messages[i]);
        }

    } catch (error) {
        console.log(error);
    }
})*/

async function updateChatScreen() {
    try {
        const token = localStorage.getItem('token');
        const messagesData = await axios.get(`${backendAPI}/message/get-messages`, { headers: { "Authorization": token } });

        clearChatUI();
        for (let i = 0; i < messagesData.data.messages.length; i++) {
            showMessagesToUI(messagesData.data.messages[i]);
        }
    } catch (error) {
        console.log(error);
    }
}

function clearChatUI() {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = "";
}

window.addEventListener("DOMContentLoaded", async () => {
    setInterval(updateChatScreen, 1000);
});


async function messageSave(event) {
    event.preventDefault();
    const message = event.target.chatInput.value;
    const msgDetails = {
        message
    }

    const token = localStorage.getItem('token');
    try {

        await axios.post(`${backendAPI}/message/post-message`, msgDetails, { headers: { "Authorization": token } }).then(response => {

            showMessagesToUI(response.data.messagesData);
        })
    }
    catch (err) {
        document.body.innerHTML = document.body.innerHTML + "<H4>Something went wrong!<h4>";
        console.log(err);
    }

}

function showMessagesToUI(messageObject) {
    const chatInput = document.querySelector("#chatInput");
    const chatMessages = document.querySelector("#chatMessages");
    const messageElement = document.createElement("div");
    const date = new Date(messageObject.createdAt);
    messageElement.innerHTML = `<b>${messageObject.memberName}</b>: ${messageObject.message} (${date.toLocaleString()})`;
    chatMessages.appendChild(messageElement);
    chatInput.value = "";
}