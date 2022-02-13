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

function displayJSON() {
    document.getElementById("db-disp").innerHTML = "";

    var table = `
        <tr>
        <th>EmpID</th>
        <th>Name</th>
        <th>Gender</th>
        <th>DoB</th>
        <th>Join Date</th>
        <th>Salary</th>
        <th>Designation</th>
        <th></th>
        </tr>`;
    
    for (let i = 0; i < JSONData.length; i++) {
        table += "<tr id='tr-" + JSONData[i].empID + "'><td>" + JSONData[i].empID + "</td>"
            + "<td>" + JSONData[i].name + "</td>" 
            + "<td>" + JSONData[i].gender + "</td>"
            + "<td>" + JSONData[i].dob + "</td>"
            + "<td>" + JSONData[i].joinDate + "</td>"
            + "<td>" + JSONData[i].salary + "</td>"
            + "<td>" + JSONData[i].designation + "</td>";
        
        table += `<td>
            <span class="material-icons clickable-icon edit" onClick="showEditPopup(${i})">edit</span>
            <span class="material-icons clickable-icon delete" onClick="deleteNode(${i})">delete</span>
            </td>`;
        table += "</tr>";
    }

    table += "</table>";
    document.getElementById("db-disp").innerHTML = table;
}

function deleteNode(nodeNum) {
    fetch(getURL() + `delete-record/${nodeNum}`, {
        method: "DELETE"
    }).then(response => {
        if (response.status === 200) {
            JSONData.splice(nodeNum, 1);

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

function showEditPopup(nodeNum) {
    document.getElementById("pop-up-title").innerText = "Edit Record";
    hideAllErrors();

    $("#pop-up").fadeIn(() => {
        $("#pop-up").css("display", "flex");
    });

    const employee = JSONData[nodeNum];

    document.getElementById("emp-id").value = employee.empID;
    document.getElementById("emp-name").value = employee.name;
    document.getElementById("emp-gender").value = employee.gender;
    document.getElementById("emp-dob").value = employee.dob;
    document.getElementById("emp-join-date").value = employee.joinDate;
    document.getElementById("emp-salary").value = employee.salary;
    document.getElementById("emp-designation").value = employee.designation;

    $("#save-changes").click(() => {
        if (checkAllValidFields()) {
            JSONData[nodeNum].empID = parseInt(document.getElementById("emp-id").value);
            JSONData[nodeNum].name = document.getElementById("emp-name").value;
            JSONData[nodeNum].gender = document.getElementById("emp-gender").value;
            JSONData[nodeNum].dob = document.getElementById("emp-dob").value;
            JSONData[nodeNum].joinDate = document.getElementById("emp-join-date").value;
            JSONData[nodeNum].salary = document.getElementById("emp-salary").value;
            JSONData[nodeNum].designation = document.getElementById("emp-designation").value;
            console.log(JSON.stringify(JSONData[nodeNum]));

            fetch(getURL() + `update-record/${nodeNum}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(JSONData[nodeNum])
            }).then(response => {
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
            
            newEmployee.empID = parseInt(document.getElementById("emp-id").value);
            newEmployee.name = document.getElementById("emp-name").value;
            newEmployee.gender = document.getElementById("emp-gender").value;
            newEmployee.dob = document.getElementById("emp-dob").value;
            newEmployee.joinDate = document.getElementById("emp-join-date").value;
            newEmployee.salary = document.getElementById("emp-salary").value;
            newEmployee.designation = document.getElementById("emp-designation").value;

            fetch(getURL() + "add-record", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEmployee)
            }).then(response => {
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
    console.log("#" + id + " " + $("#" + id).val().length);
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