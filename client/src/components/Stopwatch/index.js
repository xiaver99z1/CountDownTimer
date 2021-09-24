import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Axios from 'axios';
import moment from 'moment';
import Moment from 'react-moment';
import { BASE_URL } from '../../appContants';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function Stopwatch(){

  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [insertedId, setInsertedId] = useState(null);
  const [timeLogList, setTimeLogList] = useState([]);

  useEffect(() => {
    let interval = null;
    
    if(start){
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10)
      },10)
    }else{
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  },[start])

  useEffect(() => {
    Axios.get(`${BASE_URL}/api/logs`)
    .then(response => {
      setTimeLogList(response.data)
    });
  },[timeLogList])

  const date =  new Date().toISOString().slice(0, 10);
  const hour = ("0" +  Math.floor((time / 60000) % 60)).slice(-2);
  const min = ("0" +  Math.floor((time / 1000) % 60)).slice(-2);
  const sec =  ("0" +  ((time / 10) % 1000)).slice(-2);

  const formatedTime = `${date} ${hour}:${min}:${sec}`;

  function handleStart() {
    Axios.post(`${BASE_URL}/api/logs`,{timestamp:formatedTime, log_type:'Start', insertedId: null })
    .then(response => {
      setInsertedId(response.data.insertId)
    });

    setStart(true)
  }
  
  function handleStop() {
    Axios.post(`${BASE_URL}/api/logs`,{timestamp:formatedTime, log_type:'Stop', insertedId: insertedId })
    .then(() => {
      console.log('Time Stop has been logged');
    });
    setStart(false)
  }

  function handleReset() {
    setTime(0)
    setStart(false)
  }

  return (
      <Paper sx={{ p: 2, margin: 'auto', maxWidth: 1000, flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={8} md={8}>
            <Item  sx={{ paddingTop: 5, paddingBottom: 20 }}>
              <Grid container direction="column" spacing={2}>
                <Grid item sx={{marginBottom:5}}>
                  <Grid container direction="column" justify="center">
                    <Grid item>
                      <Typography variant="h5" gutterBottom component="div">
                        Stopwatch
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row" justify="center" spacing={0}>
                        <Grid item xs={3} />
                        <Grid item xs={1}>
                          <Typography variant="h3" gutterBottom component="div" sx={{ textAlign: 'right' }}>
                            {("0" + Math.floor((time / 60000) % 60)).slice(-2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={1} >
                          <Typography variant="h3" gutterBottom component="div">:</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="h3" gutterBottom component="div">
                            {("0" +  Math.floor((time / 1000) % 60)).slice(-2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={1} >
                          <Typography variant="h3" gutterBottom component="div">:</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <Typography variant="h3" gutterBottom component="div" sx={{ textAlign: 'left' }}>
                            {("0" + (time / 10) % 1000).slice(-2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="row">
                      <Grid item md={3} />
                      <Grid item md={2}>
                        <Button onClick={handleStart} disabled={start} variant="contained" color="success">
                          Start
                        </Button>
                      </Grid>
                      <Grid item md={2}>
                        <Button  onClick={handleStop} disabled={!start} variant="contained" color="error">
                          End
                        </Button>
                      </Grid>
                      <Grid item md={2}>
                        <Button onClick={handleReset} variant="contained"  color="primary">
                          Reset
                        </Button>
                      </Grid>
                      <Grid item md={3} />
                  </Grid>
                </Grid>
              </Grid>
            </Item>
          </Grid>
          <Grid item xs={4} md={4}>
            <Item>
              <Grid container direction="column" spacing={2}>
                <Grid item md={12}>
                  {timeLogList.map((list,index) => {
                      return (
                        <Grid container direction="row" sx={{marginBottom:1,border:'1px solid #d3d3d3'}} alignItems="center" key={index}>
                          <Grid item md={6}>
                            <Moment titleFormat="D MMM YYYYTHH:mm:ss">{list.timestamp}</Moment>  
                          </Grid>
                          <Grid item md={6}>
                            {list.log_type}
                          </Grid>
                        </Grid>
                      )
                  })}
                </Grid>
              </Grid>
            </Item>
          </Grid>
        </Grid>
      </Paper>
    );
}

export default Stopwatch;