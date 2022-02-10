const Colors = ["#d7d8d7", "#c3b8ff", "#ffb8fa", "#b8d3ff", "#ffb8b8", "#ffdcb8", "#fffeb8", "#dfffb8", "#b8ffc3"];
const Images = ["./assests/images/school_photo_shaded_cropped.jpg", "./assests/images/school_photo2_shaded_cropped.jpg"]

const app = angular.module('app', ['ngRoute']);
app.config(($routeProvider) => {
    $routeProvider
    .when("/", {
        templateUrl: '/templates/main.html'
    })
    .when("/about-us", {
        templateUrl: '/templates/about-us.html',
        controller : "aboutUsCtrl"
    })
    .when("/staff", {
        templateUrl: '/templates/staff.html',
        controller : "staffCtrl"
    })
    .when("/staff-search", {
        templateUrl: '/templates/staff-search.html',
        controller : "staffSearchCtrl"
    });
});
app.controller("aboutUsCtrl", function ($scope) {
    $scope.title = "About Us";
});
app.controller("staffCtrl", function ($scope, $http) {
    $scope.title = "Staff";

    $http.get("https://gist.githubusercontent.com/IshaanBose2147116/b75c1226ac9cb263882fcd3a69551ece/raw/62ad9060e9b770edd8d1fbe1067b1c2229359b6a/employee_data.json")
    .then((response) => {
        $scope.employees = response.data;
    });
});
app.controller("staffSearchCtrl", function ($scope, $http) {
    $scope.title = "Staff Search";

    $http.get("https://gist.githubusercontent.com/IshaanBose2147116/b75c1226ac9cb263882fcd3a69551ece/raw/62ad9060e9b770edd8d1fbe1067b1c2229359b6a/employee_data.json")
    .then((response) => {
        $scope.employees = response.data;
        var teachers = [];

        for (let i = 0; i < $scope.employees.length; i++) {
            if ($scope.employees[i].designation === "Teacher") {
                teachers.push($scope.employees[i]);
            }
        }

        $scope.employees = teachers;
    });
});
app.filter("nameFormat", () => {
    return (x) => {
        var names = x.split(" ");
        var name = "";

        for (let i = 0; i < names.length; i++) {
            name += names[i].substring(0, 1).toUpperCase() + names[i].substring(1, names[i].length) + " ";
        }

        return name.trim();
    };
});

$(document).ready(() => {
    checkIfCookiesAllowed();

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

    document.getElementById("disable-cookies").onclick = () => {
        setCookie("cookiesAllowed", false, 1);
        $("#sticky-cookie").hide();
    };

    document.getElementById("allow-cookies").onclick = () => {
        setCookie("cookiesAllowed", true, 1);
        $("#sticky-cookie").hide();
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

function checkIfCookiesAllowed() {
    var allowed = getCookie("cookiesAllowed");

    if (allowed !== "") {
        $("#sticky-cookie").hide();

        if (allowed === "true") {
            increasePageLoad();
    
            const anchorTags = document.getElementsByTagName("a");
            for (let i = 0; i < anchorTags.length; i++) {
                anchorTags[i].onclick = countLinkClicks;
            }
        }
        else {
            if (getCookie("pageLoaded") !== "")
                deleteCookie("pageLoaded");
            if (getCookie("linkClicks") !== "")
                deleteCookie("linkClicks");
        }
    }
    else {
        $("#sticky-cookie").show();
    }
}

function increasePageLoad() {
    let decodedCookie = decodeURIComponent(document.cookie);
    
    if (decodedCookie.length === 0) {
        setCookie("pageLoaded", 1, 365);
    }
    else {
        let cookieVal = parseInt(getCookie("pageLoaded"));

        if (cookieVal === 0 || isNaN(cookieVal)) {
            setCookie("pageLoaded", 1, 365);
        }
        else {
            setCookie("pageLoaded", cookieVal + 1, 365);
        }
    }

    changeColourAndImage();
}

function changeColourAndImage() {
    let pageLoaded = getCookie("pageLoaded");
    pageLoaded = parseInt(pageLoaded) - 1;
    const colour = Colors[pageLoaded % Colors.length];
    const image = Images[pageLoaded % Images.length];

    document.body.style.backgroundColor = colour;
    document.getElementsByTagName("html")[0].style.backgroundColor = colour;
    document.getElementById("school-photo").src = image;
}

function countLinkClicks() {
    let count = parseInt(getCookie("linkClicks"));

    if (count === 0 || isNaN(count)) {
        setCookie("linkClicks", 1, 365);
    }
    else {
        setCookie("linkClicks", count + 1, 365);
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

function deleteCookie(cname) {
    document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
}