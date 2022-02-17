const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab'
});

app.use(bodyParser.json());

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
.get('/employee-data', (req, res) => {
    conn.connect((err) => {
        if (err) 
            res.sendStatus(500);
        else {
            conn.query("SELECT * FROM employees", (err, results) => {
                if (err)
                    res.sendStatus(500);
                else {
                    res.json(results);
                }
            });
        }
    });
})
.put('/update-record/:empid', (req, res) => {
    conn.connect((err) => {
        if (err)
            res.sendStatus(500);
        else {
            console.log(req.body);
            conn.query(`
                update employees set empid=${ req.body.empid }, fname="${ req.body.fname }",
                lname="${ req.body.lname }", gender="${ req.body.gender }", dob="${ req.body.dob }",
                join_date="${ req.body.join_date }", salary=${ req.body.salary }, designation="${ req.body.designation }" 
                where empid=?
                `, [ req.params.empid ], (err, results) => {
                if (err)
                    res.sendStatus(500);
                else
                    res.sendStatus(200);
            });
        }
    });
})
.delete('/delete-record/:empid', (req, res) => {
    conn.connect((err) => {
        if (err)
            res.sendStatus(500);
        else {
            conn.query("DELETE FROM employees WHERE empid=?", [ req.params.empid ], (err, results) => {
                if (err)
                    res.sendStatus(500);
                else
                    res.sendStatus(200);
            });
        }
    });
})
.post('/add-record', (req, res) => {
    conn.connect((err) => {
        if (err)
            res.sendStatus(500);
        else {
            conn.query(`
                insert into employees values (${ req.body.empid }, "${ req.body.fname }", 
                "${ req.body.lname }", "${ req.body.gender }", "${ req.body.dob }", "${ req.body.join_date }", 
                ${ req.body.salary }, "${ req.body.designation }")
            `, (err, results) => {
                if (err)
                    res.sendStatus(500);
                else
                    res.sendStatus(200);
            });
        }
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