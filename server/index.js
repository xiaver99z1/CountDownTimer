const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const mysql = require('mysql2');


const db = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port:process.env.DB_PORT
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

// Get Logs
app.get('/api/logs',(_,res) => {
    const sqlInsert = "SELECT id, CONCAT(stopwatch_date,' ',stopwatch_TIME) as timestamp, log_type FROM timer_logs ORDER BY date_created desc";
    db.query(sqlInsert,(err,result) => {
 
        if(err){
            res.status(500);
            res.send(JSON.stringify({ success: false, message: "Fetching Failed!" }));
        }else{
            res.status(200);
            res.send(Object.values(JSON.parse(JSON.stringify(result))));
  
        }
    }) 
})

// Add Timer Logs
app.post('/api/logs',(req,res) => {
    const timestamp =  req.body.timestamp;
    const log_type = req.body.log_type;

    timeArray = timestamp.split(" ");

    const sqlInsert = "INSERT INTO timer_logs (stopwatch_date, stopwatch_time, log_type) VALUES (?,?,?);";
    db.query(sqlInsert,[timeArray[0],timeArray[1],log_type],(err) => {
        if(err){
            res.status(500);
            res.send(JSON.stringify({ success: false, message: `Created Failed! ${err}` }));
        }else{
            res.status(200);
            res.send(JSON.stringify({ success: true, message: "Created Successfully" }));
        }
    }) 
})

// Update Timer Logs
app.put('/api/logs/:timestamp/:log_type',(req,res) => {
    const dateTimeStampParam =  decodeURI(req.params.timestamp);
    const logTypeParam = req.params.log_type;
    const dateTime =  req.body.timestamp;
    const log_type = req.body.log_type;


    dateTimeArray = dateTime.split(" ");
    dateTimeParamArray = dateTimeStampParam.split(" ");

    const sqlInsert = 'UPDATE timer_logs SET stopwatch_date=?, stopwatch_time=?, log_type=? WHERE  stopwatch_date=? and stopwatch_time=? and log_type=?';
    db.query(sqlInsert,[dateTimeArray[0],dateTimeArray[1],log_type, dateTimeParamArray[0],dateTimeParamArray[1],logTypeParam],(err) => {
        if(err){
            res.status(500);
            res.send(JSON.stringify({ success: false, message: "Updated Failed!" }));
        }else{
            res.status(200);
            res.send(JSON.stringify({ success: true, message: "Updated!" }));
        }
    }) 

})

// Delete Timer logs
app.delete('/api/logs/:id',(req,res) => {
    const id =  decodeURI(req.params.id);
    const sqlInsert = "DELETE FROM timer_logs where id=?";
    console.log(id);
    db.query(sqlInsert,[id],(err, result) => {
        if(err){
            res.status(500);
            console.log(err);
            res.send(JSON.stringify({ success: false, message: "Delete failed!" }));
        }else{
            res.status(200);
            console.log(result);
            res.send(JSON.stringify({ success: true, message: "Deleted!" }));
        }
    })
})

app.listen(3001, () => {
    console.log("running on port 3001");
})