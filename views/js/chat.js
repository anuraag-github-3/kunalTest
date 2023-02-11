const backendAPI = 'http://localhost:3000';

let inputFieldEmpty = true;
const msgArray = [];

const chatInput = document.querySelector("#chatInput");
chatInput.addEventListener('input', () => {
    inputFieldEmpty = !chatInput.value;
});



window.addEventListener("DOMContentLoaded", async () => {
    const msgArray = await getLocalStorageMessages();
    try {
        setInterval(async () => {
            refreshMessages();
        }, 4000);
    } catch (error) {
        console.log(error);
    }
})


async function getLocalStorageMessages() {
    if (localStorage.message) {
        return await JSON.parse(localStorage.message);
    }
}


async function refreshMessages() {

    try {

        const token = localStorage.getItem('token');
        let lengthOfMessages = msgArray.length;
        let lastMessageID;
        if (lengthOfMessages != 0) {
            lastMessageID = msgArray[lengthOfMessages - 1].id;
        }
        else {
            lastMessageID = 0;
        }
        const messagesData = await axios.get(`${backendAPI}/message/get-messages?messageID=${lastMessageID}`, {
            headers: {
                "Authorization": token
            }
        });

        if (messagesData.data.messages.length != 0) {
            updateLocalStorageMesseges(messagesData.data.messages);
            for (let i = 0; i < messagesData.data.messages.length; i++) {
                showMessagesToUI(messagesData.data.messages[i]);
            }

        }

    } catch (error) {
        console.log(error);
    }
}
async function updateLocalStorageMesseges(newMessages) {
    newMessages.forEach((message) => {
        msgArray.push(message)
    })
    localStorage.message = JSON.stringify(msgArray);

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
            refreshMessages();
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