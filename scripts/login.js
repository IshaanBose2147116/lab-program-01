$(document).ready(() => {
    $("#login-container").hide();

    $("#staff-login").click((e) => { 
        $("#choice-container").fadeOut(250);
        $("#login-container").delay(400).fadeIn(250);
    });

    if ($("#emp-id").val().length !== 0)
        $("#emp-id-placeholder").addClass("placeholder-text-focus");
    if ($("#emp-pswd").val().length !== 0)
        $("#emp-pswd-placeholder").addClass("placeholder-text-focus");

    $("#emp-id").focus((e) => { 
        $("#emp-id-placeholder").addClass("placeholder-text-focus");
    });

    $("#emp-id").blur((e) => {
        if ($("#emp-id").val().length === 0) {
            $("#emp-id-placeholder").removeClass("placeholder-text-focus");
            $("#emp-id-error").text("Field cannot be empty.");
        }
        else {
            validateEmailID();
        }
    });

    document.getElementById("emp-id").onkeyup = validateEmailID;

    $("#emp-pswd").focus((e) => {
        $("#emp-pswd-placeholder").addClass("placeholder-text-focus");
    });

    $("#emp-pswd").blur((e) => {
        if ($("#emp-pswd").val().length === 0) {
            $("#emp-pswd-placeholder").removeClass("placeholder-text-focus");
            $("#password-error").text("Field cannot be empty.");
        }
        else {
            validatePassword();
        }
    });

    document.getElementById("emp-pswd").onkeyup = validatePassword;
});

function redirect() {
    if (validateEmailID()) {
        const empType = $("#emp-type :selected").val();
        var url = window.location.href;

        if (empType === "admin") {
            url = url.replace("/login.html", "/admin_dashboard.html");
            window.location.replace(url);
        }
        else {
            url = url.replace("/login.html", "/driver_dashboard.html");
            window.location.replace(url);
        }
    }
}

function validateEmailID() {
    const value = $("#emp-id").val();

    if (value.length == 0) {
        $("#emp-id-error").text("Field cannot be empty.");
    } 
    else if (isNaN(value)) { // if user has entered email
        const pattern = /^\w+\.\w+@sealbay\.in$/;

        if (pattern.test(value))
        {
            $("#emp-id-error").text("");
            return true;
        }
        else
        {
            $("#emp-id-error").text("Invalid email.");
        }
    } 
    else {
        if (value.length != 6)
        {
            $("#emp-id-error").text("Employee ID must consist of 6 numbers.");
        }    
        else
        {
            $("#emp-id-error").text("");
            return true;
        }
    }

    return false;
}

function validatePassword() {
    var value = $("#emp-pswd").val();

    if (value.length == 0) {
        $("#password-error").text("Field cannot be empty.");
    }
    else {
        var errors = "";
        console.log(value.length);
        if (value.length < 8 || value.length > 30)
            errors += "Password cannot be less than 8 or more than 30 characters.";
        else {
            if (value.search(/[a-z]/) < 0)
                errors = "Password must contain one lowercase letter.<br/>";
            if (value.search(/[A-Z]/) < 0)
                errors += "Password must contain one uppercase letter.<br/>";
            if (value.search(/[0-9]/) < 0)
                errors += "Password must contain at least one digit.<br/>";
            if (value.search(/[^\w\s]/) < 0)
                errors += "Password must contain at least one special character.<br/>";
            
            value = value.substring(1, value.length - 1);

            if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[^\w\s]).+$/.test(value)) {
                errors += ("At least 1 upper case, numeric, and special character must be EMBEDDED " 
                    + "somewhere in the middle of the password, and not just be the first or the last character "
                    + "of the password string.");
            }
        }
        
        document.getElementById("password-error").innerHTML = errors;
    }
}