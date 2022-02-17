const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer();

const app = express();
const PORT = 5000;

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/styles", express.static(path.join(__dirname, '../styles')));
app.use("/scripts", express.static(path.join(__dirname, '../scripts')));
app.use("/assests", express.static(path.join(__dirname, '../assests')));
app.use("/xml", express.static(path.join(__dirname, '../xml')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
})
.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../login.html"));
})
.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, "../admin_dashboard.html"));
})
.get('/driver-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, "../driver_dashboard.html"));
})
.post('/driver-dashboard', upload.none(), (req, res) => {
    console.log(req.body.empid);
    res.cookie("empid", req.body.empid, { maxAge: 5000, httpOnly: true });
    res.sendFile(path.join(__dirname, "../driver_dashboard.html"));
})
.get('/employee-data', (req, res) => {
    fs.readFile(path.join(__dirname, "./data/employee.json"), (err, data) => {
        data = JSON.parse(data);
        res.json(data);
    });
})
.put('/update-record/:index', (req, res) => {
    fs.readFile(path.join(__dirname, "./data/employee.json"), (err, data) => {
        data = JSON.parse(data);
        data[req.params.index] = req.body;

        fs.writeFile(path.join(__dirname, "./data/employee.json"), JSON.stringify(data, null, 4), (err) => {
            if (err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    });
})
.delete('/delete-record/:index', (req, res) => {
    fs.readFile(path.join(__dirname, "./data/employee.json"), (err, data) => {
        data = JSON.parse(data);
        data.splice(req.params.index, 1);

        fs.writeFile(path.join(__dirname, "./data/employee.json"), JSON.stringify(data, null, 4), (err) => {
            if (err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    });
})
.post('/add-record', (req, res) => {
    fs.readFile(path.join(__dirname, "./data/employee.json"), (err, data) => {
        data = JSON.parse(data);
        data.push(req.body);

        fs.writeFile(path.join(__dirname, "./data/employee.json"), JSON.stringify(data, null, 4), (err) => {
            if (err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    });
})
.get('/driver-details/:empid', (req, res) => {
    conn.connect((err) => {
        if (err)
            res.sendStatus(500);
        else {
            conn.query(`select d.emp_id, d.name, v.license_plate, r.route_start, 
            r.route_end, r.sched_start_time, r.sched_end_time, r.route_id from drivers d join vehicles v 
            on d.vehicle_id = v.vehicle_id join routes r on v.route_id = r.route_id where d.emp_id=?`,
            [ req.params.empid ], (err, result) => {
                if (err)
                    res.sendStatus(500);
                else {
                    result = result[0];
                    var final = result;

                    if (result !== undefined) {
                        conn.query(`select * from drop_offs where route_id=?`, [ final.route_id ], (err, result) => {
                            if (err) {
                                res.json(final);
                            }
                            else {
                                final.drop_offs = result;
                                res.json(final);
                            }
                        });
                    }
                    else {
                        res.sendStatus(404);
                    }
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${ PORT }`);
    console.log(__dirname);
});