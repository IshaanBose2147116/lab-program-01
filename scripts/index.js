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

    stickyNav();

    $(window).scroll(() => {
        stickyNav();
    });
});