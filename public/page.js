let newUserTimeout,
    userIDTimeout,
    descriptionTimeout,
    durationTimeout,
    dateTimeout;

// New user form controls
const userName = document.querySelector("#uname");
const userNameField = document.querySelector("#uname_field");
const submitNewUser = document.querySelector("#submit_user");

// New exercise form controls
const exerciseForm = document.querySelector("#exercise-form");
const uid = document.querySelector("#uid");
const uidField = document.querySelector("#uid_field");
const description = document.querySelector("#desc");
const descriptionField = document.querySelector("#desc_field");
const duration = document.querySelector("#dur");
const durationField = document.querySelector("#dur_field");
const date = document.querySelector("#dat");
const dateField = document.querySelector("#dat_field");
const submitNewExercise = document.querySelector("#submit_exercise");

submitNewUser.addEventListener("click", (event) => {
    if (!userName.validity.valid) {
        event.preventDefault();
        newUserValidation();
        userName.focus();
    }
});

submitNewExercise.addEventListener("click", (event) => {
    console.log(duration.validity);
    if (
        !uid.validity.valid ||
        !description.validity.valid ||
        !duration.validity.valid ||
        !isDateValid(date.value)
    ) {
        event.preventDefault();
        newExerciseValidation();
    }

    if (!isDateValid(date.value)) {
        date.setCustomValidity("Date invalid");
    } else {
        date.setCustomValidity("");
    }
});

exerciseForm.addEventListener("submit", () => {
    const userId = document.querySelector("#uid").value;
    exerciseForm.action = `/api/users/${userId}/exercises`;

    exerciseForm.submit();
});

function newUserValidation() {
    if (userName.validity.valueMissing) {
        addError(userNameField, "Username is required", newUserTimeout);
    }
}

function newExerciseValidation() {
    if (uid.validity.valueMissing) {
        addError(uidField, "User ID is required", userIDTimeout);
    }

    if (description.validity.valueMissing) {
        addError(
            descriptionField,
            "Exercise description is required",
            descriptionTimeout
        );
    }

    if (duration.validity.valueMissing) {
        addError(
            durationField,
            "Exercise duration is required",
            durationTimeout
        );
    } else if (duration.validity.badInput) {
        addError(
            durationField,
            "Exercise duration must be a number",
            durationTimeout
        );
    }

    if (!isDateValid(date.value)) {
        addError(dateField, "Date must be of format yyyy-mm-dd", dateTimeout);
    }
}

function isDateValid(date) {
    if (new Date(date).toString() === "Invalid Date" && date.trim() !== "") {
        return false;
    }

    return true;
}

function addError(div, msg, timeout) {
    clearTimeout(timeout);

    removeError(div);

    const error = document.createElement("p");
    error.classList.add("error");
    error.textContent = msg;

    div.append(error);

    timeout = setTimeout(() => {
        removeError(div);
    }, 3000);
}

function removeError(div) {
    const error = div.querySelector(".error");

    if (error) {
        div.removeChild(error);
    }
}
