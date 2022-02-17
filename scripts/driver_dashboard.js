var JSONData = null;
const DriverDetails = {
    welcomeText: document.getElementById("welcome-text"),
    empID: document.getElementById("empid"),
    vehicleID: document.getElementById("vehicle-id"),
    routeStart: document.getElementById("route-start"),
    routeEnd: document.getElementById("route-end"),
    schedStart: document.getElementById("sched-start"),
    schedEnd: document.getElementById("sched-end")
}

document.getElementById("logout").onclick = () => {
    sessionStorage.clear();
};

loadJSONData();

function loadJSONData() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            JSONData = JSON.parse(xhttp.responseText);
            console.log(JSONData);
            displayTable();
            displayDetails();
        }
    };

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    xhttp.open("GET", getURL() + `driver-details/${ params.empid }`);
    xhttp.send();
}

function displayTable() {
    var table = document.getElementById("dropoffs-table");
    var dropoffs = JSONData.drop_offs;
    
    for (let i = 0; i < dropoffs.length; i++) {
        table.innerHTML += 
            `<tr>
                <td>${ dropoffs[i].drop_address }</td>
                <td>${ dropoffs[i].no_of_students }</td>
            </tr>`;
    }
}

function displayDetails() {
    DriverDetails.welcomeText.innerText = `Welcome ${ JSONData.name }!`;
    DriverDetails.empID.innerText = JSONData.emp_id;
    DriverDetails.vehicleID.innerText = JSONData.license_plate;
    DriverDetails.routeStart.innerText = JSONData.route_start;
    DriverDetails.routeEnd.innerText = JSONData.route_end;
    DriverDetails.schedStart.innerText = JSONData.sched_start_time;
    DriverDetails.schedEnd.innerText = JSONData.sched_end_time;
}

function getURL() {
    return window.location.href.substring(0, window.location.href.indexOf("driver-dashboard"));
}