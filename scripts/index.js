$(document).ready(() => {
    var headerOffset = document.getElementById("header").offsetHeight;

    var stickyNav = () => {
        var scrollTop = $(window).scrollTop();

        if (scrollTop >= headerOffset) {
            $("#sticky-navbar").slideDown(100);
        } else {
            $("#sticky-navbar").slideUp(100);
        }
    };

    if (!window.matchMedia("(max-width: 767px").matches)
        stickyNav();
    else
        $("#sticky-navbar").hide();

    $(window).scroll(() => {
        if (!window.matchMedia("(max-width: 767px").matches)
            stickyNav();
    });

    document.getElementById("spam-number").onkeydown = checkPhoneNum;
    document.getElementById("get-spam").onclick = () => {
        if (document.getElementById("spam-number").value.length < 10) {
            $("#spam-error").text("Phone number must be at least 10 numbers long.");
        }
        else {
            $("#spam-error").text("");
        }
    };
});

function checkPhoneNum(e) {
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if (!(keyCode > 47 && keyCode < 58 || keyCode === 8)) {
        e.preventDefault();
    }
    else {
        if (document.getElementById("spam-number").value.length + 1 > 10) {
            if (keyCode !== 8)
                e.preventDefault();
        }
    }
}