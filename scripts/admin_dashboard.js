var filterBy = "empid";
document.getElementsByTagName("pre")[0].style.display = "none";

const button = document.getElementById("json");
button.onclick = () => {
    if (json.value === "View JSON Data") {
        json.value = "Hide JSON Data";
        document.getElementsByTagName("pre")[0].style.display = "inherit";
    }
    else {
        json.value = "View JSON Data";
        document.getElementsByTagName("pre")[0].style.display = "none";
    }
};

document.getElementById("short").onclick = () => {
    var $scope = getScope();
    $scope.genderLimit = 1;
    $scope.$apply();
};

document.getElementById("full").onclick = () => {
    var $scope = getScope();
    $scope.genderLimit = 6;
    $scope.$apply();
};

var app = angular.module('app', []);

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

app.filter("custFormat", () => {
    return (x) => {
        var newText = "";
        x = x.toString();

        for (let i = 0; i < x.length; i++) {
            newText += x[i] + " ";
        }

        return newText;
    };
});

app.controller("dataController", ($scope, $http) => {
    $http.get("https://gist.githubusercontent.com/IshaanBose2147116/b75c1226ac9cb263882fcd3a69551ece/raw/62ad9060e9b770edd8d1fbe1067b1c2229359b6a/employee_data.json")
    .then((response) => {
        $scope.employees = response.data;
        
        if (localStorage.addedRecords)
            $scope.addedRecords = localStorage.addedRecords;
        else
            $scope.addedRecords = 0;
        
        if (localStorage.editedRecords)
            $scope.editedRecords = localStorage.editedRecords;
        else
            $scope.editedRecords = 0;
        
        if (localStorage.deletedRecords)
            $scope.deletedRecords = localStorage.deletedRecords;
        else
            $scope.deletedRecords = 0;
        
        $scope.genderLimit = 6;
    });
});

function getScope() {
    var sel = 'div[ng-controller="dataController"]';
    return angular.element(sel).scope();
}