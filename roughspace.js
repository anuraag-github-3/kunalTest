const getUserGroups = async (req, res) => {
    try {

        const userGroups = await Member.findOne({
            where: {
                id: req.user.id
            },
            include: {
                model: Group
            }
        })

        const userGroupsJSON = userGroups.toJSON();
        // console.log(userGroupsJSON.Groups[1].createdBy);
        // res.status(200).json(userGroups);


        for (let group of userGroupsJSON.Groups) {
            const creator = await Member.findOne({
                where: {
                    id: group.createdBy
                }
            });

            group.createdByName = creator.userName;
        }
        console.log(userGroupsJSON);
    }
    catch (err) {
        console.error(err);
        res.status(400).json(null);
    }
}


async function showGroup(id) {
    const token = localStorage.getItem('token');


    const groupDetails = await axios.post(`${backendAPI}/group/GroupInfo`, { id: id }, { headers: { "Authorization": token } });

    console.log(groupDetails.data, '000000 groupdetails')


    const groupInfoDiv = document.querySelector("#groupInfo");


    const imgContDiv = document.createElement("div");
    imgContDiv.classList.add("img_cont");
    const imgElement = document.createElement("img");
    imgElement.src = groupDetails.groupPhotoURL
    imgElement.classList.add("rounded-circle", "user_img");
    imgContDiv.appendChild(imgElement);

    // Add the new "img_cont" div to the "groupInfo" div
    groupInfoDiv.appendChild(imgContDiv);

    // Create a new div with class "user_info" and a span and p child
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("user_info");
    const spanElement = document.createElement("span");
    spanElement.textContent = "kunal";
    const pElement = document.createElement("p");
    pElement.textContent = groupDetails.groupAdmin;
    userInfoDiv.appendChild(spanElement);
    userInfoDiv.appendChild(pElement);

    // Add the new "user_info" div to the "groupInfo" div
    groupInfoDiv.appendChild(userInfoDiv);

    // Update the span and p elements with new text

}


async function showGroup(id) {
    const token = localStorage.getItem('token');


    const groupDetails = await axios.post(`${backendAPI}/group/GroupInfo`, { id: id }, { headers: { "Authorization": token } });

    console.log(groupDetails.data, '000000 groupdetails')


    const groupInfoDiv = document.querySelector("#groupInfo");

    // Create a new div with class "img_cont" and an img child
    const imgContDiv = document.createElement("div");
    imgContDiv.classList.add("img_cont");
    const imgElement = document.createElement("img");
    imgElement.src = groupDetails.data.groupPhotoURL
    imgElement.classList.add("rounded-circle", "user_img");
    imgContDiv.appendChild(imgElement);

    // Add the new "img_cont" div to the "groupInfo" div
    groupInfoDiv.appendChild(imgContDiv);

    // Create a new div with class "user_info" and a span and p child
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("user_info");
    const spanElement = document.createElement("span");
    spanElement.textContent = groupDetails.data.groupName;
    const pElement = document.createElement("p");
    pElement.textContent = groupDetails.groupAdmin;
    userInfoDiv.appendChild(spanElement);
    userInfoDiv.appendChild(pElement);

    // Add the new "user_info" div to the "groupInfo" div
    groupInfoDiv.appendChild(userInfoDiv);

    // Update the span and p elements with new text

}


const getMemberList = async (req, res) => {
    try {
        let getMembers;
        const memberID = req.user.id;
        if (req.params.groupId) {
            getMembers = await members.findAll({
                where: {
                    id: {
                        [Op.not]: memberID
                    },
                    '$groups.id$': {
                        [Op.ne]: req.params.groupId
                    }
                },
                include: [{
                    model: groups,
                    through: {
                        attributes: []
                    }
                }]
            });
        }
        else {
            const memberID = req.user.id;
            getMembers = await members.findAll({
                where: {
                    id: {
                        [Op.not]: req.user.id
                    }
                }
            });
        }


        const memberList = getMembers.filter(member => member.id !== memberID)
            .map(member => ({ name: member.userName, id: member.id }));

        return res.status(200).json(Object.values(memberList));


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving the member list." });
    }

}


//showmembers
const showMemberBtn = document.querySelector('#showMember');
showMemberBtn.addEventListener('click', async function () {
    const tableBody = document.querySelector('.groupParticipants');
    tableBody.innerHTML = '';
    const groupId = localStorage.getItem('groupChatID');
    const memberID = localStorage.getItem('memberID');
    let groupMembers = await axios.get(`${backendAPI}/group/getGroupMembers/${groupId}`, { headers: { "Authorization": token } });
    groupMembers = groupMembers.data.memberlist;


    groupMembers.forEach(async user => {
        const tableRow = document.createElement('tr');
        const userName = document.createElement('th');
        userName.setAttribute('scope', 'row');
        userName.innerHTML = user.name;

        const column1 = document.createElement('td');
        const column2 = document.createElement('td');



        const removeAdmin = document.createElement('button');
        removeAdmin.setAttribute('class', 'btn btn-primary');

        const addAdmin = document.createElement('button');
        addAdmin.setAttribute('class', 'btn btn-primary');

        const removeButton = document.createElement('button');
        removeButton.setAttribute('class', 'btn btn-primary');

        const addToButton = document.createElement('button');
        addToButton.setAttribute('class', 'btn btn-primary');
        const isParticipant = await axios.get(`${backendAPI}/group/checkGroupUser?groupId=${groupId}&userId=${user.id}`, { headers: { "Authorization": token } });
        if (isParticipant.data) {
            const isAdmin = await axios.get(`${backendAPI}/admin/checkAdmin?groupId=${groupId}&userId=${user.id}`, { headers: { "Authorization": token } })
            if (isAdmin.data) {
                removeAdmin.innerHTML = 'Remove Admin';
                column1.appendChild(removeAdmin);
                removeAdmin.addEventListener('click', async () => {
                    await axios.post(`${backendAPI}/admin/removeAdmin`, {
                        GroupId: groupId,
                        userId: user.id
                    }, { headers: { "Authorization": token } });
                });
            } else {
                addAdmin.innerHTML = 'Make Admin';
                column1.appendChild(addAdmin);
                addAdmin.addEventListener('click', async () => {
                    await axios.post(`${backendAPI}/admin/makeNewAdmin`, {
                        GroupId: groupId,
                        userId: user.id
                    }, { headers: { "Authorization": token } });
                });
            }
            removeButton.innerHTML = 'Remove';
            column2.appendChild(removeButton);
            removeButton.addEventListener('click', async () => {
                await axios.post(`${backendAPI}/group/removeFromGroup`, {
                    GroupId: groupId,
                    userId: user.id
                }, { headers: { "Authorization": token } });
            })
        } else {
            addToButton.innerHTML = 'Add';
            column2.appendChild(addToButton);
            addToButton.addEventListener('click', async () => {
                await axios.post(`${backendAPI}/group/addNewGroupUser`, {
                    GroupId: groupId,
                    userId: user.id
                }, { fields: ['GroupId', 'userId'] }, { headers: { "Authorization": token } });
            })
        }
        tableRow.appendChild(userName);
        tableRow.appendChild(column1);
        tableRow.appendChild(column2);
        tableBody.appendChild(tableRow);

    });

})


//showmembers

const showMemberBtn1 = document.querySelector('#showMember');
showMemberBtn.addEventListener('click', async function () {
    const tableBody = document.querySelector('.groupParticipants');
    tableBody.innerHTML = '';
    const groupId = localStorage.getItem('groupChatID');
    const memberID = localStorage.getItem('memberID');
    let groupMembers = await axios.get(`${backendAPI}/group/getGroupMembers/${groupId}`, { headers: { "Authorization": token } });
    groupMembers = groupMembers.data.memberlist;

    for (const user of groupMembers) {
        const tableRow = document.createElement('tr');
        const userName = document.createElement('th');
        userName.setAttribute('scope', 'row');
        userName.innerHTML = user.name;

        const column1 = document.createElement('td');
        const column2 = document.createElement('td');

        const removeAdmin = document.createElement('button');
        removeAdmin.setAttribute('class', 'btn btn-primary');
        const addAdmin = document.createElement('button');
        addAdmin.setAttribute('class', 'btn btn-primary');
        const removeButton = document.createElement('button');
        removeButton.setAttribute('class', 'btn btn-primary');
        const addToButton = document.createElement('button');
        addToButton.setAttribute('class', 'btn btn-primary');

        const isParticipant = await axios.get(`${backendAPI}/group/checkGroupUser?groupId=${groupId}&userId=${user.id}`, { headers: { "Authorization": token } });

        if (isParticipant.data) {
            const isAdmin = await axios.get(`${backendAPI}/admin/checkAdmin?groupId=${groupId}&userId=${user.id}`, { headers: { "Authorization": token } })

            if (isAdmin.data) {
                removeAdmin.innerHTML = 'Remove Admin';
                column1.appendChild(removeAdmin);
                removeAdmin.addEventListener('click', async () => {
                    await handleRemoveAdmin(groupId, user.id);
                });
            } else {
                addAdmin.innerHTML = 'Make Admin';
                column1.appendChild(addAdmin);
                addAdmin.addEventListener('click', async () => {
                    await handleMakeAdmin(groupId, user.id);
                });
            }

            removeButton.innerHTML = 'Remove';
            column2.appendChild(removeButton);
            removeButton.addEventListener('click', async () => {
                await handleRemoveFromGroup(groupId, user.id);
            })
        } else {
            addToButton.innerHTML = 'Add';
            column2.appendChild(addToButton);
            addToButton.addEventListener('click', async () => {
                await handleAddToGroup(groupId, user.id);
            })
        }

        tableRow.appendChild(userName);
        tableRow.appendChild(column1);
        tableRow.appendChild(column2);
        tableBody.appendChild(tableRow)
    }
})
