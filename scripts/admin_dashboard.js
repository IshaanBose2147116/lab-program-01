const XMlFileLocation = "../xml/employee-data.xml";
var XMLFile = null;

function loadXML() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            XMLFile = xhttp.responseXML;
            displayXML();
        }
    }

    xhttp.open("GET", XMlFileLocation, true);
    xhttp.send();
}

function displayXML() {
    document.getElementById("db-disp").innerHTML = "";

    var employees = XMLFile.getElementsByTagName("employee");
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
    
    for (let i = 0; i < employees.length; i++)
    {
        var empID = employees[i].getAttribute("emp-id");
        table += "<tr id='tr-" + empID + "'><td>" + empID + "</td>";
        var children = employees[i].childNodes;
        
        for (let j = 0; j < children.length; j++)
        {
            if (children[j].nodeType == 1)
            {
                table += "<td>" + children[j].childNodes[0].nodeValue + "</td>";
            }
        }
        
        table += `<td>
        <span class="material-icons clickable-icon edit" onClick="showEditPopup(` + i + `)">edit</span>
        <span class="material-icons clickable-icon delete" onClick="deleteNode(` + i + `)">delete</span>
        </td>`;
        table += "</tr>";
    }

    table += "</table>";
    document.getElementById("db-disp").innerHTML = table;
}

function deleteNode(nodeNum) {
    var employee = XMLFile.getElementsByTagName("employee")[nodeNum];
    employee.parentNode.removeChild(employee);
    displayXML();
}

function showEditPopup(nodeNum) {
    $("#pop-up-title").text("Edit Record");
    hideAllErrors();

    $("#pop-up").fadeIn(() => {
        $("#pop-up").css("display", "flex");
    });

    const employee = XMLFile.getElementsByTagName("employee")[nodeNum];
    const employeeDetails = employee.childNodes;
    const empID = employee.getAttribute("emp-id");
    $("#emp-id").val(empID);
    
    for (let i = 0; i < employeeDetails.length; i++) {
        if (employeeDetails[i].nodeType == 1) {
            var val = employeeDetails[i].childNodes[0].nodeValue;

            switch (employeeDetails[i].nodeName) {
                case "name":
                    $("#emp-name").val(val);
                    break;

                case "gender":
                    $("#emp-gender").val(val);
                    break;
                
                case "dob":
                    $("#emp-dob").val(val);
                    break;
                
                case "join-date":
                    $("#emp-join-date").val(val);
                    break;
                
                case "salary":
                    $("#emp-salary").val(val);
                    break;
                
                case "designation":
                    $("#emp-designation").val(val);
                    break;

                default:
                    break;
            }
        }
    }

    $("#save-changes").click(() => {
        if (checkAllValidFields()) {
            employee.setAttribute("emp-id", $("#emp-id").val());
    
            for (let i = 0; i < employeeDetails.length; i++) {
                if (employeeDetails[i].nodeType == 1) {
                    switch (employeeDetails[i].nodeName) {
                        case "name":
                            employeeDetails[i].childNodes[0].nodeValue = $("#emp-name").val();
                            break;
        
                        case "gender":
                            employeeDetails[i].childNodes[0].nodeValue = $("#emp-gender").val();
                            break;
                        
                        case "dob":
                            employeeDetails[i].childNodes[0].nodeValue = $("#emp-dob").val();
                            break;
                        
                        case "join-date":
                            employeeDetails[i].childNodes[0].nodeValue = $("#emp-join-date").val();
                            break;
                        
                        case "salary":
                            employeeDetails[i].childNodes[0].nodeValue = $("#emp-salary").val();
                            break;
                        
                        case "designation":
                            employeeDetails[i].childNodes[0].nodeValue = $("#emp-designation").val();
                            break;
        
                        default:
                            break;
                    }
                }
            }
            
            $("#pop-up").fadeOut(() => {
                $("#save-changes").off("click");
                displayXML();
            });
        }
    });
}

function showCreatePopup() {
    $("#emp-id").val("");
    $("#emp-name").val("");
    $("#emp-gender").val("");
    $("#emp-dob").val("");
    $("#emp-join-date").val("");
    $("#emp-salary").val("");
    $("#emp-designation").val("");
    $("#pop-up-title").text("Create Record");
    hideAllErrors();

    $("#pop-up").fadeIn(() => {
        $("#pop-up").css("display", "flex");
    });

    $("#save-changes").click(() => {
        if (checkAllValidFields()) {
            const newEmployee = XMLFile.createElement("employee");
            newEmployee.setAttribute("emp-id", $("#emp-id").val());
            
            const nameElement = XMLFile.createElement("name");
            nameElement.appendChild(XMLFile.createTextNode($("#emp-name").val()));
            const genderELement = XMLFile.createElement("gender");
            genderELement.appendChild(XMLFile.createTextNode($("#emp-gender").val()));
            const dobElement = XMLFile.createElement("dob");
            dobElement.appendChild(XMLFile.createTextNode($("#emp-dob").val()));
            const joinDateElement = XMLFile.createElement("join-date");
            joinDateElement.appendChild(XMLFile.createTextNode($("#emp-join-date").val()));
            const salaryElement = XMLFile.createElement("salary");
            salaryElement.appendChild(XMLFile.createTextNode($("#emp-salary").val()));
            const designationElement = XMLFile.createElement("designation");
            designationElement.appendChild(XMLFile.createTextNode($("#emp-designation").val()));

            newEmployee.appendChild(nameElement);
            newEmployee.appendChild(genderELement);
            newEmployee.appendChild(dobElement);
            newEmployee.appendChild(joinDateElement);
            newEmployee.appendChild(salaryElement);
            newEmployee.appendChild(designationElement);

            XMLFile.documentElement.appendChild(newEmployee);

            $("#pop-up").fadeOut(() => {
                $("#save-changes").off("click");
                displayXML();
            });
        }
    });
}

$(document).ready(() => {
    loadXML();
    
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
            $("save-changes").off("click");
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