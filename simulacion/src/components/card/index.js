import React, { useEffect, useState } from 'react';
import ApiRequest from '../../util/ApiRequest'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chart from 'chart.js';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './_shared.css';

const Card = () => {

    const useStyles = makeStyles((theme) => ({
        button: {
            '& > *': {
                margin: theme.spacing(1),
            },
        text_box: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
    }}));
    const classes = useStyles();
    const [datos, setDatos] = useState(null);
    const [interval, setInterval] = useState('');
    const [chart, setChart] = useState(null);
    const [n, setN] = useState(null);
    const [x, setX] = useState(null);
    const [k, setK] = useState(null);
    const [c, setC] = useState(null);
    const [g, setG] = useState(null);
    const [enviar, setEnviar] = useState(false);

    function handleChangeN(event) {
        setN(event.target.value);

    }
    function handleChangeX(event) {
        setX(event.target.value);

    }
    function handleChangeK(event) {
        setK(event.target.value);

    }
    function handleChangeC(event) {
        setC(event.target.value);

    }
    function handleChangeG(event) {
        setG(event.target.value);

    }

    function handleChange (event) {
        setInterval(event.target.value);
        console.log(interval);
    }

    function handleChangeSend (event) {
        setEnviar(true);

    }
    useEffect(() => {
        console.log(enviar)
        if (enviar === true ){
            llamarApi(n, x, k, c, g, interval);
            setEnviar(false);
        }

    }, [enviar])

    function llamarApi (n, x, k, c, g, interval) {
        ApiRequest.get(`/congruencial-lineal`, {n: n, x: x, k: k, c: c, g: g, intervalos: interval})

            .then(async ({ data }) => {
            let tableData = data.map(dato => JSON.parse(dato)).map(d => {
                return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
            });

            let tableDataList = [...tableData]
            console.log(tableDataList);
            setDatos(tableDataList)

            window.google.charts.load('current', { packages: ['corechart'] });
            window.google.charts.setOnLoadCallback(drawChart);

        })
    }


    function drawChart() {
        setEnviar(false)
        let ctx = document.getElementById('myChart');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: datos?.map(d => d[1]),
                    datasets: [{
                        label: '# Histograma',
                        data: datos?.map(d => d[0]),
                        backgroundColor:
                            datos?.map(d => 'rgba(54, 162, 235, 0.2)'),
                        borderColor:
                            datos?.map(d => 'rgba(54, 162, 235, 1)'),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
    }


    return (
        <div>
            <div className={classes.text_box}>
            <FormControl>
            <InputLabel  id="demo-simple-select-label">Intervalos</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={interval}
              onChange={handleChange}
              style={{ width: 100 }}
              >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
            </FormControl>
            </div>
            <br/>

            <div className={classes.text_box}>
            <TextField id="outlined-basic" label="Tamaño de muestra (n)" variant="outlined" value={n} onChange={handleChangeN}/>
            </div>
            <div className={classes.text_box}>
                <TextField id="outlined-basic" label="Valor de la semilla (x)" variant="outlined" value={x} onChange={handleChangeX}/>
            </div>
            <div className={classes.text_box}>
                <TextField id="outlined-basic" label="Valor de K" variant="outlined" value={k} onChange={handleChangeK}/>
            </div>
            <div className={classes.text_box}>
                <TextField id="outlined-basic" label="Valor de G" variant="outlined" value={g} onChange={handleChangeG}/>
            </div>
            <div className={classes.text_box}>
                <TextField id="outlined-basic" label="Valor de C" variant="outlined" value={c} onChange={handleChangeC}/>
            </div>
              <div className={classes.button}>
                   <Button variant="contained" color="primary" onClick={handleChangeSend}>
                        Enviar
                   </Button>
              </div>


            <div style={{ textAlign: '-webkit-center' }}>
                <canvas id="myChart" className="chart" width="400" height="400"></canvas>
            </div>


        </div>

    );
};

export default Card;
