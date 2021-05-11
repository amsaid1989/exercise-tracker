// Timeout variables that will control hiding the various
// form errors
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
const uidDiv = document.querySelector("#uid_field"); // uid input and errors container
const uid = document.querySelector("#uid");
const descriptionDiv = document.querySelector("#desc_field"); // description input and errors container
const description = document.querySelector("#desc");
const durationDiv = document.querySelector("#dur_field"); // duration input and errors container
const duration = document.querySelector("#dur");
const dateDiv = document.querySelector("#dat_field"); // date input and errors container
const date = document.querySelector("#dat");
const submitNewExercise = document.querySelector("#submit_exercise");

submitNewUser.addEventListener("click", (event) => {
    if (!userName.validity.valid) {
        event.preventDefault();
        newUserValidation();
        userName.focus();
    }
});

submitNewExercise.addEventListener("click", (event) => {
    // Checks to see if any of the form inputs is invalid,
    // and if true, prevents the form from submitting, and
    // displays the proper error messages
    if (
        !uid.validity.valid ||
        !description.validity.valid ||
        !duration.validity.valid ||
        !isDateValid(date.value)
    ) {
        event.preventDefault();
        newExerciseValidation();
    }

    // Check if the date input is not valid and set a custom
    // validity on it. This adds the 'invalid' pseudo class
    // on the input, so it has a visual representation to
    // indicate that it has an issue. Once the data is valid,
    // the custom validity is cleared
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
    // Displays the appropriate error messages if the new
    // user input is invalid
    if (userName.validity.valueMissing) {
        addError(userNameField, "Username is required", newUserTimeout);
    }
}

function newExerciseValidation() {
    // Displays the appropriate error messages if any of the
    // new exercise form inputs is invalid

    if (uid.validity.valueMissing) {
        addError(uidDiv, "User ID is required", userIDTimeout);
    }

    if (description.validity.valueMissing) {
        addError(
            descriptionDiv,
            "Exercise description is required",
            descriptionTimeout
        );
    }

    if (duration.validity.valueMissing) {
        addError(durationDiv, "Exercise duration is required", durationTimeout);
    } else if (duration.validity.badInput) {
        addError(
            durationDiv,
            "Exercise duration must be a number",
            durationTimeout
        );
    }

    if (!isDateValid(date.value)) {
        addError(dateDiv, "Date must be of format yyyy-mm-dd", dateTimeout);
    }
}

function isDateValid(date) {
    // Checks the string in the date input to ensure it represents
    // a valid date. If the string is valid or the field is empty,
    // the check returns true. Otherwise, it returns false
    if (new Date(date).toString() === "Invalid Date" && date.trim() !== "") {
        return false;
    }

    return true;
}

function addError(div, msg, timeout) {
    // General function that displays an error message below the
    // invalid input. It does that by appending it to the parent
    // container which is passed as the first argument

    // If there is an error already displayed, clear the timeout
    // and remove the error immediately before adding the new one
    clearTimeout(timeout);
    removeError(div);

    // Create the new error with the message passed as the second
    // argument, add it to the container, then activate the
    // timeout to remove the error after a couple of seconds
    const error = document.createElement("p");
    error.classList.add("error");
    error.textContent = msg;

    div.append(error);

    timeout = setTimeout(() => {
        removeError(div);
    }, 3000);
}

function removeError(div) {
    // Remove the error message from the div container
    const error = div.querySelector(".error");

    if (error) {
        div.removeChild(error);
    }
}
