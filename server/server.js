const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const jsonParser = bodyParser.json();

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
    fs.readFile(path.join(__dirname, "./data/employee.json"), (err, data) => {
        data = JSON.parse(data);
        res.json(data);
    });
})
.put('/update-record/:index', jsonParser, (req, res) => {
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
.post('/add-record', jsonParser, (req, res) => {
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
});

app.use("/styles", express.static(path.join(__dirname, '../styles')));
app.use("/scripts", express.static(path.join(__dirname, '../scripts')));
app.use("/assests", express.static(path.join(__dirname, '../assests')));
app.use("/xml", express.static(path.join(__dirname, '../xml')));

app.listen(PORT, () => {
    console.log(`Listening on port: ${ PORT }`);
    console.log(__dirname);
});