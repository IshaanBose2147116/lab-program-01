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
            console.log("Type:" + children[j].nodeType + " Name:" + children[j].nodeName + " Value:" + children[j].nodeValue);
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
        console.log(table);
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
        alert(nodeNum);
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

    $("#pop-up").fadeIn(() => {
        $("#pop-up").css("display", "flex");
    });

    $("#save-changes").click(() => {
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
    });
}

$(document).ready(() => {
    loadXML();
    
    $("#pop-up").hide();

    $(document).mouseup((e) => { 
        var container = $("#pop-up");

        if (!container.is(e.target) && container.has(e.target).length == 0)
        {
            container.fadeOut();
        }
    });
});