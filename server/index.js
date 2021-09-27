const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user:'root',
    password:"",
    database: "stopwatchdb"
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/api/logs',(req,res) => {
    const timestamp =  req.body.timestamp;
    const log_type = req.body.log_type;
    const sqlInsert = "SELECT * FROM timer_logs ORDER BY id desc";
    db.query(sqlInsert,(err,result) => {
        res.send(result);
    }) 
})

app.post('/api/logs',(req,res) => {
    const timestamp =  req.body.timestamp;
    const log_type = req.body.log_type;

    const sqlInsert = "INSERT INTO timer_logs (timestamp, log_type) VALUES (?,?);";
    db.query(sqlInsert,[timestamp,log_type],(err,result) => {
        res.send(result);
    }) 
})

app.put('/api/logs/:timestamp/:log_type',(req,res) => {
    const timestampParam =  decodeURI(req.params.timestamp);
    const logTypeParam = req.params.log_type;
    const timestamp =  req.body.timestamp;
    const log_type = req.body.log_type;
    console.log('~~', timestampParam,' - ', logTypeParam, ' | ', timestamp, ' - ', log_type);
    const sqlInsert = `UPDATE timer_logs SET timestamp="${timestamp}", log_type="${log_type}" WHERE timestamp="${timestampParam}" and log_type="${logTypeParam}"`;
    db.query(sqlInsert,(err,result) => {
        res.send(result);
    }) 
})

app.listen(3001, () => {
    console.log("running on port 3001");
})