const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");

const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");

})

sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");

})

const host = 'localhost';
const protocol = 'http';
const port = 3000;

async function SignIn(event) {
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
    }
    console.log('hii', newUser);
    try {
        await axios.post(`${protocol}://${host}:${port}/newUser/add`, obj).then(response => {

            alert('Registered Successfully. Login!!');
        })
    }
    catch (err) {

        alert('Oopss! User exists Already!! Login Please');
    }

}