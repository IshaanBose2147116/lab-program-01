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
});