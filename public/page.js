const errorMsg = document.querySelector("#error");
let errorTimeout;

// New user form controls
const userName = document.querySelector("#uname");
const submitNewUser = document.querySelector("#submit_user");

// New exercise form controls
const exerciseForm = document.querySelector("#exercise-form");

submitNewUser.addEventListener("click", (event) => {
    if (!userName.validity.valid) {
        event.preventDefault();
        newUserValidation();
        showErrorMsg();
        errorTimeout = setTimeout(hideErrorMsg, 5000);
        userName.focus();
    }
});

exerciseForm.addEventListener("submit", () => {
    const userId = document.querySelector("uid").value;
    exerciseForm.action = `/api/users/${userId}/exercises`;

    exerciseForm.submit();
});

function newUserValidation() {
    if (userName.validity.valueMissing) {
        errorMsg.textContent = "Please enter a user name";
    }
}

function showErrorMsg() {
    clearTimeout(errorTimeout);
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("visible");
}

function hideErrorMsg() {
    errorMsg.classList.remove("visible");
    errorMsg.classList.add("hidden");
}
