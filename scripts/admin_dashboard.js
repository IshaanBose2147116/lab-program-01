const Records = {
    added: document.getElementById("added-records"),
    edited: document.getElementById("edited-records"),
    deleted: document.getElementById("deleted-records")
};
var JSONURL = getURL() + "employee-data";
var JSONData = [];

function loadStats() {
    if (localStorage.addedRecords)
        Records.added.innerText = localStorage.addedRecords;
    else
        Records.added.innerText = "0";
    
    if (localStorage.editedRecords)
        Records.edited.innerText = localStorage.editedRecords;
    else
        Records.edited.innerText = "0";
    
    if (localStorage.deletedRecords)
        Records.deleted.innerText = localStorage.deletedRecords;
    else
        Records.deleted.innerText = "0";
}

function loadJSON() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            JSONData = JSON.parse(xhttp.responseText);
            console.log(JSONData);
            displayJSON();
        }
    };

    xhttp.open("GET", JSONURL, true);
    xhttp.send();
}

function displayJSON(filtered) {
    var table = document.getElementById("disp-data");
    table.innerHTML = "";

    var dispVals = filtered === undefined ? JSONData : filtered;

    for (let i = 0; i < dispVals.length; i++) {
        table.innerHTML += 
        `<tr>
            <td>${ dispVals[i].empid }</td>
            <td>${ dispVals[i].fname + " " + dispVals[i].lname }</td>
            <td>${ dispVals[i].gender }</td>
            <td>${ dispVals[i].dob.split("T")[0] }</td>
            <td>${ dispVals[i].join_date.split("T")[0] }</td>
            <td>${ dispVals[i].salary }</td>
            <td>${ dispVals[i].designation }</td>
            <td>
                <span class="material-icons clickable-icon edit" onClick="showEditPopup(${ dispVals[i].empid })">edit</span>
                <span class="material-icons clickable-icon delete" onClick="deleteNode(${ dispVals[i].empid })">delete</span>
            </td>
        </tr>`;
    }

    // search events
    var searchInputs = document.getElementsByClassName("search");

    for (let i = 0; i < searchInputs.length; i++) {
        searchInputs[i].oninput = search;
    }

    function search() {
        var filterEmpID = document.getElementById("search-empid").value;
        var filterName = document.getElementById("search-name").value.toLowerCase();
        var filterGender = document.getElementById("search-gender").value.toLowerCase();
        var filterDoB = document.getElementById("search-dob").value;
        var filterJoinDate = document.getElementById("search-join-date").value;
        var filterSalary = document.getElementById("search-salary").value;
        var filterDesignation = document.getElementById("search-designation").value.toLowerCase();

        console.log("EmpID: ", filterEmpID, "Name: ", filterName, "Gender: ", filterGender, "DoB: ", filterDoB, 
        "JoinDate: ", filterJoinDate, "Salary: ", filterSalary, "Designation: ", filterDesignation);
        var filtered = [];

        for (let i = 0; i < JSONData.length; i++) {
            if (JSONData[i].empid.toString().includes(filterEmpID)
                && (JSONData[i].fname.toLowerCase().includes(filterName) || JSONData[i].lname.toLowerCase().includes(filterName))
                && JSONData[i].gender.toLowerCase().includes(filterGender) && JSONData[i].dob.includes(filterDoB)
                && JSONData[i].join_date.includes(filterJoinDate) && JSONData[i].salary.includes(filterSalary)
                && JSONData[i].designation.toLowerCase().includes(filterDesignation))
                    filtered.push(JSONData[i]);
        }

        displayJSON(filtered);
    }
}

function deleteNode(empid) {
    fetch(getURL() + `delete-record/${empid}`, {
        method: "DELETE"
    }).then(response => {
        if (response.status === 200) {
            var updatedData = [];
            
            for (let i = 0; i < JSONData.length; i++) {
                if (JSONData[i].empid !== empid) {
                    updatedData.push(JSONData[i]);
                }
            }

            JSONData = updatedData;

            if (localStorage.deletedRecords) {
                localStorage.deletedRecords = Number(localStorage.deletedRecords) + 1;
            }
            else {
                localStorage.deletedRecords = 1;
            }

            Records.deleted.innerText = localStorage.deletedRecords;

            displayJSON();
        }
    });
}

function showEditPopup(empid) {
    document.getElementById("pop-up-title").innerText = "Edit Record";
    hideAllErrors();

    $("#pop-up").fadeIn(() => {
        $("#pop-up").css("display", "flex");
    });

    var employee = null;
    let i = 0;

    for (; i < JSONData.length; i++) {
        if (JSONData[i].empid === empid) {
            employee = JSONData[i];
            break;
        }
    }

    document.getElementById("emp-id").value = employee.empid;
    document.getElementById("emp-name").value = employee.fname + " " + employee.lname;
    document.getElementById("emp-gender").value = employee.gender;
    document.getElementById("emp-dob").value = employee.dob.split("T")[0];
    document.getElementById("emp-join-date").value = employee.join_date.split("T")[0];
    document.getElementById("emp-salary").value = employee.salary;
    document.getElementById("emp-designation").value = employee.designation;

    $("#save-changes").click(() => {
        if (checkAllValidFields()) {
            console.log("after save: ", JSONData, "i: ", i);
            JSONData[i].empid = parseInt(document.getElementById("emp-id").value);
            JSONData[i].fname = document.getElementById("emp-name").value.split(" ")[0];
            JSONData[i].lname = document.getElementById("emp-name").value.split(" ")[1];
            JSONData[i].gender = document.getElementById("emp-gender").value;
            JSONData[i].dob = document.getElementById("emp-dob").value;
            JSONData[i].join_date = document.getElementById("emp-join-date").value;
            JSONData[i].salary = document.getElementById("emp-salary").value;
            JSONData[i].designation = document.getElementById("emp-designation").value;

            fetch(getURL() + `update-record/${empid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(JSONData[i])
            }).then(response => {
                console.log(response.status);
                if (response.status === 200) {
                    if (localStorage.editedRecords) {
                        localStorage.editedRecords = Number(localStorage.editedRecords) + 1;
                    }
                    else {
                        localStorage.editedRecords = 1;
                    }
        
                    Records.edited.innerText = localStorage.editedRecords;
                    
                    $("#pop-up").fadeOut(() => {
                        $("#save-changes").off("click");
                        displayJSON();
                    });
                }
            });
        }
    });
}

function showCreatePopup() {
    document.getElementById("emp-id").value = "";
    document.getElementById("emp-name").value = "";
    document.getElementById("emp-gender").value = "";
    document.getElementById("emp-dob").value = "";
    document.getElementById("emp-join-date").value = "";
    document.getElementById("emp-salary").value = "";
    document.getElementById("emp-designation").value = "";

    document.getElementById("pop-up-title").innerText = "Create Record";
    hideAllErrors();

    $("#pop-up").fadeIn(() => {
        $("#pop-up").css("display", "flex");
    });

    $("#save-changes").click(() => {
        if (checkAllValidFields()) {
            var newEmployee = {};
            
            newEmployee.empid = parseInt(document.getElementById("emp-id").value);
            newEmployee.fname = document.getElementById("emp-name").value.split(" ")[0];
            newEmployee.lname = document.getElementById("emp-name").value.split(" ")[1];
            newEmployee.gender = document.getElementById("emp-gender").value;
            newEmployee.dob = document.getElementById("emp-dob").value;
            newEmployee.join_date = document.getElementById("emp-join-date").value;
            newEmployee.salary = document.getElementById("emp-salary").value;
            newEmployee.designation = document.getElementById("emp-designation").value;
            console.log("new employee: ", newEmployee);

            fetch(getURL() + "add-record", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEmployee)
            }).then(response => {
                console.log("status: ", response.status);
                if (response.status === 200) {
                    JSONData.push(newEmployee);

                    if (localStorage.addedRecords) {
                        localStorage.addedRecords = Number(localStorage.addedRecords) + 1;
                    }
                    else {
                        localStorage.addedRecords = 1;
                    }

                    Records.added.innerText = localStorage.addedRecords;

                    $("#pop-up").fadeOut(() => {
                        $("#save-changes").off("click");
                        displayJSON();
                    });
                }
            });
        }
    });
}

$(document).ready(() => {
    loadStats();
    loadJSON();
    
    $("#pop-up").hide();
    
    // emp-id events
    $("#emp-id").blur((e) => {
        if ($("#emp-id").val().length === 0) {
            showError("emp-id-error", "Field cannot be empty.");
        }
        else {
            validateEmpID(null);
        }
    });

    document.getElementById("emp-id").onkeydown = (e) => {
        if (/[a-zA-Z\W]/.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
        }
        else {
            validateEmpID(e);
        }
    };

    // emp-name events
    $("#emp-name").blur((e) => {
        if ($("#emp-name").val().trim().length === 0) {
            showError("emp-name-error", "Field cannot be empty.");
        }
        else {
            validateName();
        }
    });

    document.getElementById("emp-name").onkeydown = (e) => {
        if (!/[a-zA-Z]/.test(e.key) && e.key !== "Backspace" && e.key !== " "
            && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
            e.preventDefault();
        }
        else {
            if (document.getElementById("emp-name").value.length === 0) {
                if (e.key === " ")
                    e.preventDefault();
            }
        }
    };

    // emp-gender events
    $("#emp-gender").blur((e) => {
        if ($("#emp-gender").val().length === 0) {
            $("#emp-gender-error").text("Field cannot be empty.");
            $("#emp-gender-error").css("opacity", "1");
        }
        else {
            validateGender();
        }
    });

    document.getElementById("emp-gender").onkeyup = (e) => {
        validateGender();
    }

    // emp-dob events
    $("#emp-dob").blur((e) => {
        checkNotEmpty("emp-dob");
    });

    // emp-join-date events
    $("#emp-join-date").blur((e) => {
        checkNotEmpty("emp-join-date");
    });

    // emp-salary events
    $("#emp-salary").blur((e) => {
        
        if ($("#emp-salary").val().length === 0) {
            $("#emp-salary-error").text("Field cannot be empty.");
            $("#emp-salary-error").css("opacity", "1");
        }
        else {
            validateSalary();
        }
    });

    document.getElementById("emp-salary").onkeydown = (e) => {
        if (!/\d|\./.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight")
            e.preventDefault();
    }

    document.getElementById("emp-salary").onkeyup = (e) => {
        validateSalary();
    }

    // emp-designation events
    $("#emp-designation").blur((e) => {
        checkNotEmpty("emp-designation");
    });

    $(document).mouseup((e) => { 
        var container = $("#pop-up");

        if (!container.is(e.target) && container.has(e.target).length == 0)
        {
            container.fadeOut();
            $("#save-changes").off("click");
        }
    });

    document.getElementById("logout").onclick = (e) => {
        sessionStorage.clear();
    };

    document.getElementById("refresh-icon").onclick = () => {
        loadJSON();
    }
});

function showError(id, message) {
    $("#" + id).text(message);
    $("#" + id).css("opacity", "1");
}

function hideError(id) {
    $("#" + id).text("error");
    $("#" + id).css("opacity", "0");
}

function hideAllErrors() {
    hideError("emp-id-error");
    hideError("emp-name-error");
    hideError("emp-gender-error");
    hideError("emp-dob-error");
    hideError("emp-join-date-error");
    hideError("emp-salary-error");
    hideError("emp-designation-error");
}

function validateEmpID(e) {
    let len = document.getElementById("emp-id").value.length;
    len = e !== null ? len + 1 : len;

    if (len > 6) {
        if (e !== null && e.key !== "Backspace")
            e.preventDefault();
        else
            showError("emp-id-error", "ID must be 6 digits long.");
    }
    else {
        if (len < 6 || (e !== null && e.key === "Backspace")) {
            showError("emp-id-error", "ID must be 6 digits long.");
        }
        else {
            hideError("emp-id-error");
            return true;
        }
    }

    return false;
}

function validateName() {
    const name = $("#emp-name").val();
    
    if (/^[a-zA-Z]+\s[a-zA-Z]+\s?[a-zA-Z]+?$/.test(name)) {
        hideError("emp-name-error");
        return true;
    }
    else {
        showError("emp-name-error", "Pattern: Fname [Mname] Lname");
        return false;
    }
}

function validateGender() {
    if (/^(((m|M)ale)|((f|F)emale)|(NB))$/.test($("#emp-gender").val())) {
        hideError("emp-gender-error");
        return true;
    }
    else {
        showError("emp-gender-error", "Male, female, or NB.");
        return false;
    }
}

function validateSalary() {
    const salaryVal = $("#emp-salary").val();

    if (/^\d{5,6}\.\d{2}$/.test(salaryVal)) {
        if (parseFloat(salaryVal) < 12500 || parseFloat(salaryVal) > 250000) {
            showError("emp-salary-error", "Must be between 12500 and 250000.");
        }
        else {
            hideError("emp-salary-error");
            return true;
        }
    }
    else {
        if (parseFloat(salaryVal) < 12500 || parseFloat(salaryVal) > 250000) {
            showError("emp-salary-error", "Must be between 12500 and 250000.");
        }
        else {
            showError("emp-salary-error", "Pattern: 99999.99");
            return true;
        }
    }

    return false;
}

function checkNotEmpty(id) {
    if ($("#" + id).val().length === 0) {
        showError(id + "-error", "Field cannot be empty.");
        return false;
    }
    else {
        hideError(id + "-error");
        return true;
    }
}

function checkAllValidFields() {
    const validID = validateEmpID(null),
    validName = validateName(), 
    validGender = validateGender(),
    validSalary = validateSalary(), 
    validDOB = checkNotEmpty("emp-dob"),
    validJoinDate = checkNotEmpty("emp-join-date"),
    validDesignation = checkNotEmpty("emp-designation");

    return (
        validID && validName && validGender && validSalary && validDOB && validJoinDate && validDesignation
    );
}

function getURL() {
    return window.location.href.substring(0, window.location.href.indexOf("admin-dashboard"));
}