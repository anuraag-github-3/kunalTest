const apiUrl = 'http://localhost:3000';
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");

const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");

})

sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");

})

async function handleSignInSubmit(event) {
    event.preventDefault();

    const userName = event.target.userName.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;

    const newUser = {
        userName,
        email,
        phone,
        password
    };

    try {
        const response = await axios.post(`${apiUrl}/newUser/signin`, newUser);

        // If the server returns a success message, show an alert with the message
        if (response.data.message) {
            alert(response.data.message);
        }
    } catch (err) {
        // If the server returns an error, show an alert with the error message
        alert(err.response.data.message || 'User already exists! Please sign in or try a different email address');
    }
}


async function handleLoginSubmit(event) {
    event.preventDefault();

    const mail = event.target.mail.value;
    const password = event.target.password.value;
    const loginDetail = { mail, password };

    try {
        const response = await axios.post(`${apiUrl}/user/login`, loginDetail);

        if (response.status === 200) {
            alert(response.data.message);

        }
    } catch (err) {
        const errorMessage = err.response?.data.message || "Incorrect Credentials! Please try again";
        alert(errorMessage);
        console.error("Error during login", JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red;"> ${err.message} <div>`;
    }
}
