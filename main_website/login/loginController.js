
$(document).ready(function () {

    $("#loginForm").submit(function (event) {

        var send = true;

        var username = $('#loginForm input[name="username"]').val();

        if (username == "") {

            showError("You must provide a username.");

            return false;
        }

        var password = $('#loginForm input[name="password"]').val();

        if (password == "") {

            showError("You must provide a password.");

            return false;
        }
    });

});

function showError(message) {

    $("#errorMessage").text(message);
}