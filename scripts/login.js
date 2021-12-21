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
        if ($("#emp-id").val().length === 0)
            $("#emp-id-placeholder").removeClass("placeholder-text-focus");
    });

    $("#emp-pswd").focus((e) => {
        $("#emp-pswd-placeholder").addClass("placeholder-text-focus");
    });

    $("#emp-pswd").blur((e) => {
        if ($("#emp-pswd").val().length === 0)
        $("#emp-pswd-placeholder").removeClass("placeholder-text-focus");
    });
});

function redirect() {
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