import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Moment from 'react-moment';

import { START, STOP } from '../../appContants';
import { getStopwatchList, addStopwatchList, updateStopwatchList } from '../../actions/getStopwatch';
import { connect } from 'react-redux'
import StopwatchService from '../../services/StopwatchService';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

function Stopwatch(props){
  const { timeLogList, timer, getStopwatchList, addStopwatchList } = props

  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);

  const date =  new Date().toISOString().slice(0, 10);
  const hour = ("0" +  Math.floor((time / 60000) % 60)).slice(-2);
  const min = ("0" +  Math.floor((time / 1000) % 60)).slice(-2);
  const sec =  ("0" +  ((time / 10) % 1000)).slice(-2);

  const formatedTime = `${date} ${hour}:${min}:${sec}`;

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
    getStopwatchList()
  },[])

  const handleStart = async () => {
      const data = {
        ...timer,
        timestamp: formatedTime
      }

      try {
        await StopwatchService.add(data);
        getStopwatchList() // with thunk
        addStopwatchList({...data, log_type: STOP})
      }  catch (error) {
        if (error.response) {
            console.log(error.response.data)
        }
        else if (error.request) {
            console.log(error.request)
        }
        console.log(error.message)
      }

      setStart(true)
  }
  
  const handleStop = async () => {
    const params = {
      ...timer,
      log_type: START
  }
    const data = {
      ...timer,
      timestamp: formatedTime,
    }

    const encodedTimestamp = encodeURI(params.timestamp);

    await StopwatchService.update(encodedTimestamp, params.log_type, data);
    getStopwatchList() // with thunk
    updateStopwatchList({...data, log_type: START})
    setStart(false)
  }

  function handleReset() {
    setTime(0)
    setStart(false)
  }

  return (
      <Paper sx={{ p: 2, margin: 2, maxWidth: 1000, flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Item  sx={{ paddingTop: 5, paddingBottom: 5 }}>
              <Grid container direction="column" spacing={0} justify="center">
                <Grid item sx={{marginBottom:5}}>
                  <Grid container direction="column" justify="center">
                    <Grid item xs={12}>
                      <Typography variant="h5" gutterBottom component="div">
                        Stopwatch
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row" justify="center" spacing={0}>
                        <Grid item xs={2} sx={{marginLeft:1.5}}>
                          <Typography variant="h3" gutterBottom component="div" sx={{ textAlign: 'right' }}>
                            {("0" + Math.floor((time / 360000) % 60)).slice(-2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={1} >
                          <Typography variant="h3" gutterBottom component="div">:</Typography>
                        </Grid>
                        <Grid item xs={2}>
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
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="row" spacing={0} wrap="nowrap">
                      <Grid item md={4} xs={4}>
                        <Button onClick={handleStart} disabled={start} variant="contained" color="success">
                          Start
                        </Button>
                      </Grid>
                      <Grid item md={4} xs={4}>
                        <Button  onClick={handleStop} disabled={!start} variant="contained" color="error">
                          End
                        </Button>
                      </Grid>
                      <Grid item md={4} xs={4}>
                        <Button onClick={handleReset} variant="contained"  color="primary">
                          Reset
                        </Button>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Item>
          </Grid>
          <Grid item xs={12} md={4}>
            <Item>
              <Grid container direction="column" spacing={2}>
                <Grid item md={12}>
                  {timeLogList.map((list,index) => {
                      return (
                        <Grid container direction="row" sx={{marginBottom:1,border:'1px solid #d3d3d3'}} alignItems="center" key={index}>
                          <Grid item md={6} xs="6">
                            <Moment titleFormat="D MMM YYYYTHH:mm:ss">{list.timestamp}</Moment>  
                          </Grid>
                          <Grid item md={6} xs="6">
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

const mapStateToProps = state => {
    return {
      timeLogList: state.timeLogList, 
      timer: state.timer
    }
}

const mapDispatchToProps = {
  getStopwatchList,
  addStopwatchList,
  updateStopwatchList,
}

export default connect(mapStateToProps, mapDispatchToProps)(Stopwatch)