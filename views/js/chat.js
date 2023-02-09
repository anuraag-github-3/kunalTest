const backendAPI = 'http://localhost:3000';

let inputFieldEmpty = true;

const chatInput = document.querySelector("#chatInput");
chatInput.addEventListener('input', () => {
    inputFieldEmpty = !chatInput.value;
});

const msgArray = [];

window.addEventListener("DOMContentLoaded", async () => {
    try {

        const token = localStorage.getItem('token');
        refreshMessages(token);

        setInterval(async () => {
            refreshMessages(token);
        }, 4000);
    } catch (error) {
        console.log(error);
    }
})

async function refreshMessages(token) {
    try {
        const messagesData = await axios.get(`${backendAPI}/message/get-messages`, { headers: { "Authorization": token } })
        const chatMessages = document.querySelector("#chatMessages");
        chatMessages.innerHTML = '';

        for (let i = 0; i < messagesData.data.messages.length; i++) {
            showMessagesToUI(messagesData.data.messages[i]);
        }
    } catch (error) {
        console.log(error);
    }
}



async function messageSave(event) {
    event.preventDefault();
    const message = event.target.chatInput.value;
    const msgDetails = {
        message
    }

    const token = localStorage.getItem('token');
    try {

        await axios.post(`${backendAPI}/message/post-message`, msgDetails, { headers: { "Authorization": token } }).then(response => {
            chatInput.value = "";
            showMessagesToUI(response.data.messagesData);
            refreshMessages(token);


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
    if (inputFieldEmpty) {
        chatInput.value = "";
    }
}
