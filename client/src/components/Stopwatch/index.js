import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Moment from 'react-moment';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { START, STOP } from '../../appContants';
import { getStopwatchList, addStopwatchList, updateStopwatchList } from '../../actions/getStopwatch';
import { connect } from 'react-redux'
import StopwatchService from '../../services/StopwatchService';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #d3d3d3',
    boxShadow: 24,
    p: 4,
  };

function Stopwatch(props){
  const { timeLogList, timer, getStopwatchList, addStopwatchList } = props

  const [openConfDel, setOpenDelConf] = useState(false);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [delId, setDelId] = useState(0);
  

  const date =  new Date().toISOString().slice(0, 10);

  const hour = ("0" +  Math.floor((time / 360000) % 60)).slice(-2);
  const min = ("0" +  Math.floor((time / 60000) % 60)).slice(-2);
  const sec = ("0" +  Math.floor((time / 1000) % 60)).slice(-2);

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
        log_type: START,
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

  const handleRemove = async () => {
    const encodedId = encodeURI(delId);
    await StopwatchService.remove(encodedId);
    getStopwatchList() // with thunk
    setOpenDelConf(false);
  }

  const handleConfirmDelete = (id) => {
    setOpenDelConf(true)
    setDelId(id)
  }

  const handleCloseConfirmDelete = () => {
    setOpenDelConf(false)
  }

  const renderModal = () => {
    return (
      <Modal
      open={openConfDel}
      onClose={handleCloseConfirmDelete}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Delete a record
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
         are you sure do you want to remove this record?
        </Typography>
        <Stack mt={4} sx={{ width: '100%' }} spacing={2}>
          <Grid container direction="row" justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button onClick={handleRemove} xs={6} sm={6} variant="contained" color="success">
                  Yes
              </Button>
              </Grid>
              <Grid item>
              <Button onClick={handleCloseConfirmDelete} xs={6} sm={6} variant="outlined">
                  No
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Modal>
    )
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
              <Grid container direction="column" spacing={2} style={{ minHeight: 300, overflowY: 'scroll' }}>
                <Grid item md={12}>
                  {timeLogList.length > 0 && timeLogList.map((list,index) => {
                    const start = '4:00';
                      return (
                        <Grid container direction="row" spacing={1} sx={{marginBottom:1,border:'1px solid #d3d3d3'}} alignItems="center" key={list.id}>
                          <Grid item md={1} sm={1} xs={1}>
                           {(timeLogList.length - index)}
                          </Grid>
                          <Grid item md={5} sm={6} xs={6}>
                            <Moment date={list.timestamp} parse="YYYY-MM-DD hh:mm:ss" />  
                          </Grid>
                          <Grid item md={4} sm={4} xs={3}>
                            {list.log_type}
                          </Grid>
                          <Grid item md={1} sm={1} xs={1}>
                            <IconButton aria-label="delete" color="error"  onClick={() => handleConfirmDelete(list.id)}>
                              <DeleteIcon /> 
                            </IconButton>
                          </Grid>
                        </Grid>
                      )
                  })}
                </Grid>
              </Grid>
              {renderModal()}
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