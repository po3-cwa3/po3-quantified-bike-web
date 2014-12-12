
$(document).ready(function () {

    // Before the login form submits, check whether the inputs are valid
    $("#loginForm").submit(function (event) {

        var send = true;

        // Get the username
        var username = $('#loginForm input[name="username"]').val();

        // If ther username is empty, present an error and don't submit
        if (username == "") {

            showError("You must provide a username.");

            return false;
        }

        // Get the password
        var password = $('#loginForm input[name="password"]').val();

        // If the password is empty, present an error and don't submit
        if (password == "") {

            showError("You must provide a password.");

            return false;
        }
    });

});

// This function is used to set an error message above the login form
function showError(message) {

    $("#errorMessage").text(message);
}