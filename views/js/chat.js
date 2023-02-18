const backendAPI = 'http://localhost:3000';
const token = localStorage.getItem('token');


//to decode JWT token
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const chatElements = document.querySelectorAll(".contacts .d-flex");
chatElements.forEach(element => {
    element.addEventListener("click", event => {
        // Remove the "active" class from the current active chat
        document.querySelector(".contacts .active").classList.remove("active");
        // Add the "active" class to the selected chat
        event.currentTarget.classList.add("active");
    });
});

//to make buttons color when mouse hover
function attachButtonEventListeners(id) {
    const button = document.getElementById(id);

    button.addEventListener("mouseover", function () {
        this.style.backgroundColor = "blue";
        this.style.cursor = "pointer";
    });

    button.addEventListener("mouseout", function () {
        this.style.backgroundColor = "rgba(0,0,255,0.3)";
        this.style.cursor = "default";
    });
}

attachButtonEventListeners("createGroupButton");
attachButtonEventListeners("removeAdminButton");
attachButtonEventListeners("addAdminButton");




window.addEventListener("DOMContentLoaded", async () => {
    try {


        const decodeToken = parseJwt(token);
        url = decodeToken.picLink;
        name = decodeToken.userName;
        localStorage.setItem('memberID', decodeToken.userId);
        const parentNode = document.getElementById('profilePic');
        const childNode = `<img src="${url}"
        class="rounded-circle user_img">`
        parentNode.innerHTML = parentNode.innerHTML + childNode;

        const parentNode2 = document.getElementById("user_info");
        const childNode2 = `<span>${name}</span>
        <p>Online</p>`
        parentNode2.innerHTML = parentNode2.innerHTML + childNode2;

        //to get list of groups the the user has joined
        let listOfGroup = await axios.get(`${backendAPI}/group/getUserGroups`, { headers: { "Authorization": token } });
        let listOfGroups = listOfGroup.data.Groups;


        listOfGroups.forEach(async group => {
            showGrouptoUI(group)
        })
    }
    catch (error) {
        console.log(error);
    }
})

//show group to side bar
async function showGrouptoUI(groupInfo) {

    const list = document.querySelector('.contacts');

    const item = document.createElement('li');
    item.classList.add('active');
    item.setAttribute('data-group-id', groupInfo.id);

    item.addEventListener('click', async () => {
        const groupId = item.getAttribute('data-group-id');
        showGroup(groupId);
    });

    const flex = document.createElement('div');
    flex.classList.add('d-flex', 'bd-highlight');
    item.appendChild(flex);

    const imgCont = document.createElement('div');
    imgCont.classList.add('img_cont');
    flex.appendChild(imgCont);

    const img = document.createElement('img');
    img.src = groupInfo.groupPhoto;
    img.classList.add('rounded-circle', 'user_img');
    imgCont.appendChild(img);

    const onlineIcon = document.createElement('span');
    onlineIcon.classList.add('online_icon');
    imgCont.appendChild(onlineIcon);

    const userInfo = document.createElement('div');
    userInfo.classList.add('user_info');
    flex.appendChild(userInfo);

    const span = document.createElement('span');
    span.textContent = groupInfo.name;
    userInfo.appendChild(span);

    const p = document.createElement('p');
    p.textContent = groupInfo.createdByName;
    userInfo.appendChild(p);

    list.appendChild(item);
}

//show group on top when a particular group is clicked
async function showGroup(id) {
    localStorage.setItem('groupChatID', id);
    const groupDetails = await axios.post(`${backendAPI}/group/GroupInfo`, { id: id }, { headers: { "Authorization": token } });


    const groupInfoDiv = document.querySelector("#groupInfo");

    // Create a new div with class "img_cont" and an img child
    const imgContDiv = document.createElement("div");
    imgContDiv.classList.add("img_cont");
    const imgElement = document.createElement("img");
    imgElement.src = groupDetails.data.groupPhotoURL
    imgElement.classList.add("rounded-circle", "user_img");
    imgContDiv.appendChild(imgElement);

    groupInfoDiv.children = null;
    // Add the new "img_cont" div to the "groupInfo" div
    groupInfoDiv.appendChild(imgContDiv);

    // Create a new div with class "user_info" and a span and p child
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("user_info");
    const spanElement = document.createElement("span");
    spanElement.textContent = groupDetails.data.groupName;
    const pElement = document.createElement("p");
    pElement.textContent = groupDetails.data.groupAdmin;

    userInfoDiv.appendChild(spanElement);

    userInfoDiv.appendChild(pElement);

    // Add the new "user_info" div to the "groupInfo" div
    groupInfoDiv.appendChild(userInfoDiv);

    createGroupChatScreen(id);

    const checkGroupAdmin = await axios.get(`${backendAPI}/admin/checkAdmin?groupId=${id}`, { headers: { "Authorization": token } });
    if (checkGroupAdmin.data) {
        const groupNameH2 = document.createElement('h2');
        groupNameH2.innerHTML = 'HELLO';
        const adminBtn = document.createElement('button');
        adminBtn.setAttribute('class', 'btn btn-primary');
        adminBtn.setAttribute('style', 'display: inline; margin-left: 10px; background-color: #913175; border-color: #CD5888;');
        adminBtn.setAttribute('data-target', '#adminControls');
        adminBtn.setAttribute('data-toggle', 'modal');
        adminBtn.innerHTML = 'Manage Members';
        groupNameH2.appendChild(adminBtn);

        adminBtn.addEventListener('click', () => {
            showGroupParticipants(id);
        })
    }
}

async function createGroupChatScreen(id) {
    let response = await axios.get(`${backendAPI}/message/getGroupMessages/${id}`, { headers: { "Authorization": token } });
    let messages = response.data;

    // iterate through the messages and add each one to the UI
    for (let i = 0; i < messages.length; i++) {
        await addMessagetoUI(messages[i]);
    }
}

async function addMessagetoUI(message) {
    var msgCardBody = document.querySelector('.card-body.msg_card_body');

    // create the message container
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('d-flex', 'justify-content-start', 'mb-4');

    // Create a container for the user image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('img_cont_msg');

    const image = document.createElement('img');
    image.src = message.memberPic;
    image.classList.add('rounded-circle', 'user_img_msg');

    imageContainer.appendChild(image);

    // create the message text container
    var messageTextContainer = document.createElement('div');
    messageTextContainer.classList.add('msg_cotainer');

    // create the message text and time
    var messageText = document.createElement('span');
    messageText.textContent = message.message;

    var messageTime = document.createElement('span');
    var timeString = message.time;
    var date = new Date(timeString);
    messageTime.textContent = date.toLocaleString();
    messageTime.classList.add('msg_time');

    // add the message text and time to the message text container
    messageTextContainer.appendChild(messageText);
    messageTextContainer.appendChild(messageTime);

    // add the message text container to the message container
    messageContainer.appendChild(imageContainer);
    messageContainer.appendChild(messageTextContainer);


    // add the message container to the message card body container
    msgCardBody.appendChild(messageContainer);

}


//to send message
document.querySelector('#sendMessage').addEventListener('click', async () => {
    const groupId = localStorage.getItem('groupChatID');
    const message = document.querySelector('#userMessage').value;
    const memberID = localStorage.getItem('memberID');

    const messagePost = await axios.post(`${backendAPI}/message/newGroupMessage`, {
        message: message,
        chatGroupId: groupId,
        memberID: memberID
    }, { headers: { "Authorization": token } })
    addMessagetoUI(messagePost.data[0])
    document.querySelector('#userMessage').value = '';
})


//buttons-->{create group, add admin, remove admin}
document.getElementById("createGroupButton").addEventListener("click", async () => {

    const usersSelect = document.querySelector('#groupUsers');
    usersSelect.innerHTML = '';
    const memberList = await axios.get(`${backendAPI}/members/memberslist/0`, { headers: { "Authorization": token } })

    const modal = document.querySelector('.modal.fade');
    modal.classList.remove('modal');
    modal.classList.remove('fade');

    const usersList = memberList.data;

    usersList.forEach(user => {
        const option = document.createElement('option');
        option.innerHTML = user.name;
        option.setAttribute('value', user.id);
        usersSelect.appendChild(option);
    });
})
document.querySelector('#createGroupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const groupName = document.querySelector('#newGroupName').value;
    const groupPhoto = document.querySelector('#groupPhotoURL').value;
    const groupUsers = [];
    for (let option of document.querySelector('#groupUsers').options) {
        if (option.selected) {
            groupUsers.push(parseInt(option.value));
        }
    }

    const createGroup = await axios.post(`${backendAPI}/group/createGroup`, {
        groupName: groupName,
        groupMembers: groupUsers,
        groupPhoto: groupPhoto
    }, { headers: { "Authorization": token } });
    showGrouptoUI(createGroup.data);

    await axios.post(`${backendAPI}/admin/makeGroupAdmin`, {
        GroupId: createGroup.data.id
    }, { headers: { "Authorization": token } })
})


document.getElementById("addAdminButton").addEventListener("click", async () => {

    const usersSelect = document.querySelector('#newAdmins');
    usersSelect.innerHTML = '';
    const groupId = localStorage.getItem('groupChatID');

    const checkGroupAdmin = await axios.get(`${backendAPI}/admin/checkAdmin?groupId=${groupId}`, { headers: { "Authorization": token } });
    if (checkGroupAdmin.data) {

        const groupId = localStorage.getItem('groupChatID');
        const groupMembers = await axios.get(`${backendAPI}/group/getGroupMembers/${groupId}`, { headers: { "Authorization": token } })

        const modal = document.querySelector('.modal.fade');
        modal.classList.remove('modal');
        modal.classList.remove('fade');

        const membersList = groupMembers.data.memberlist;

        membersList.forEach(user => {
            const option = document.createElement('option');
            option.innerHTML = user.name;
            option.setAttribute('value', user.id);
            usersSelect.appendChild(option);
        });
    }

    else {
        alert("Ooops!! you are not admin");
    }
})

document.querySelector('#createAddAdminForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const groupId = localStorage.getItem('groupChatID');
    const groupAdmins = [];
    for (let option of document.querySelector('#newAdmins').options) {
        if (option.selected) {
            groupAdmins.push(parseInt(option.value));
        }
    }

    for (var i = 0; i < groupAdmins.length; i++) {
        await axios.post(`${backendAPI}/admin/makeGroupAdmin`, {
            groupId: groupId,
            newAdminId: groupAdmins[0]
        }, { headers: { "Authorization": token } });
    }
})

document.getElementById("removeAdminButton").addEventListener("click", async () => {
    const usersSelect = document.querySelector('#deleteAdmins');
    usersSelect.innerHTML = '';
    const groupId = localStorage.getItem('groupChatID');

    const checkGroupAdmin = await axios.get(`${backendAPI}/admin/checkAdmin?groupId=${groupId}`, { headers: { "Authorization": token } });
    if (checkGroupAdmin.data) {

        const groupId = localStorage.getItem('groupChatID');
        const groupAdmins = await axios.get(`${backendAPI}/admin/getGroupAdmins/${groupId}`, { headers: { "Authorization": token } })

        const modal = document.querySelector('.modal.fade');
        modal.classList.remove('modal');
        modal.classList.remove('fade');


        const membersList = groupAdmins.data;
        membersList.forEach(user => {
            const option = document.createElement('option');
            option.innerHTML = user.AdminName;
            option.setAttribute('value', user.memberId);
            usersSelect.appendChild(option);
        });
    }

    else {
        alert("Ooops!! you are not admin");
    }
})

document.querySelector('#removeAdminForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const groupId = localStorage.getItem('groupChatID');
    const groupAdminToBeRemove = [];
    for (let option of document.querySelector('#deleteAdmins').options) {
        if (option.selected) {
            groupAdminToBeRemove.push(parseInt(option.value));
        }
    }

    for (var i = 0; i < groupAdminToBeRemove.length; i++) {
        await axios.post(`${backendAPI}/admin/removeAdmin`, {
            GroupId: groupId,
            AdminId: groupAdminToBeRemove[i]
        }, { headers: { "Authorization": token } });
    }
})


const attachBtn = document.querySelector('.attach_btn');
const fileInput = document.querySelector('#fileInput');

attachBtn.addEventListener('click', () => {
    fileInput.click();

});

async function uploadFile() {

    const groupId = localStorage.getItem('groupChatID');
    const fileInput = document.querySelector('#fileInput');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);

    await axios.post(`${backendAPI}/message/uploadFile/${groupId}`, formData, {
        headers: {
            "Authorization": token,
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        console.log('File uploaded successfully');
    }).catch(error => {
        console.error(error);
    });
}



document.getElementById("createGroupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("createNewGroupBtn").style.display = "none";
    document.getElementById("createNewGroupBtn").setAttribute("tabindex", "-1");
});

document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("createNewGroupBtn").style.display = "none";
    document.getElementById("createNewGroupBtn").setAttribute("tabindex", "-1");
});

