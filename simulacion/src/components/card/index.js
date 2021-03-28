import React, { useEffect, useState } from 'react';
import ApiRequest from '../../util/ApiRequest'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Chart from 'chart.js';
import './_shared.css';

const Card = () => {
    
    const [interval, setInterval] = React.useState('');
    const [datos, setDatos] = useState(null);
    const [x, setX] = useState(null);
    const [k, setK] = useState(null);
    const [n, setN] = useState(null);
    const [g, setG] = useState(null);
    const [c, setC] = useState(null);
    window.google.charts.load('current', { packages: ['corechart'] });


const [chart, setChart] = useState(null);
const [method, setMethod] = useState(null);
function drawChart() {
    var ctx = document.getElementById('myChart');
    chart?.destroy()
    setChart(new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos?.map(d => d[1].toFixed(4)),
            datasets: [{
                label: 'Frecuencias',
                data: datos?.map(d => d[0]),
                backgroundColor: 
                datos?.map(d => 'rgba(54, 162, 235, 0.2)'),
                borderColor:
                datos?.map(d => 'rgba(54, 162, 235, 1)'),
                borderWidth: 1,
                barThickness: datos ? 460 / datos.length : 'flex'
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
    }));
}
/* 
n: 1000, x: 17, k: 2, g:5, intervalos: interval
n: 1000, x: 6, k: 3, c: 7, g:3, intervalos: interval
n: 1000, intervalos: interval
*/
    useEffect(()=> {
        drawChart();
    }, [datos])
    
    const handleChangeInterval = (event) => {
        setInterval(event.target.value);
      };

    const handleChangeMethod = (event) => {
      setMethod(event.target.value);
    };

    const handleChangeN = (event) => {
        setN(event.target.value);
      };

    const handleChangeX = (event) => {
        setX(event.target.value);
      };

      const handleChangeK = (event) => {
        setK(event.target.value);
      };

      const handleChangeC = (event) => {
        setC(event.target.value);
      };

      const handleChangeG = (event) => {
        setG(event.target.value);
      };

      const handleChangeSend = (event) => {
        switch (method) {
            case 'full-random':
                ApiRequest.get('/full-random', {n, intervalos: interval}).then(async ({ data }) => {
                    let tableData = data.map(dato => JSON.parse(dato)).map(d => {
                        return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
                    });
                    
                    let tableDataList = [...tableData]
                    setDatos(tableDataList);
                })
                break;
            case 'congruencial-lineal':
                ApiRequest.get(`/congruencial-lineal`, {n, x, k, c, g, intervalos: interval}).then(async ({ data }) => {
                    let tableData = data.map(dato => JSON.parse(dato)).map(d => {
                        return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
                    });
                    
                    let tableDataList = [...tableData]
                    setDatos(tableDataList);
                })
                break;
            case 'congruencial-multiplicativo':
                ApiRequest.get(`/congruencial-multiplicativo`, {n, x, k, g, intervalos: interval}).then(async ({ data }) => {
                    let tableData = data.map(dato => JSON.parse(dato)).map(d => {
                        return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
                    });
                    
                    let tableDataList = [...tableData]
                    setDatos(tableDataList);
                })    
                break;
            default:
                break;
        }
      };

    return (
        <div class="column">
            <div class="histogram">
                <canvas id="myChart" className="chart"></canvas>
                <span class="text">Intervalos</span>
            </div>
            <div class="row">
            <FormControl className="select">
            <InputLabel id="method-select-label">Método</InputLabel>
            <Select
              labelId="method-select-label"
              id="method-select"
              value={method}
              onChange={handleChangeMethod}
              style={{ width: 200 }}
              >
              <MenuItem value={'congruencial-lineal'}>Congruencial lineal</MenuItem>
              <MenuItem value={'congruencial-multiplicativo'}>Congruencial multiplicativo</MenuItem>
              <MenuItem value={'full-random'}>Random</MenuItem>
            </Select>
            </FormControl>
            <FormControl className="select">
            <InputLabel id="intervalos-select-label">Intervalos</InputLabel>

            <Select
              labelId="intervalos-select-label"
              id="intervalos-select"
              value={interval}
              onChange={handleChangeInterval}
              style={{ width: 200 }}
              >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
            </FormControl>
        </div>
        <div class="row">
            <TextField id="outlined-basic" label="Tamaño de muestra (n)" variant="outlined" value={n} onChange={handleChangeN}/>
            <TextField id="outlined-basic" label="Valor de la semilla (x)" variant="outlined" value={x} onChange={handleChangeX}/>
            <TextField id="outlined-basic" label="Valor de K" variant="outlined" value={k} onChange={handleChangeK}/>
            <TextField id="outlined-basic" label="Valor de G" variant="outlined" value={g} onChange={handleChangeG}/>
            <TextField id="outlined-basic" label="Valor de C" variant="outlined" value={c} onChange={handleChangeC}/>
        </div>
                   <Button variant="contained" color="primary" onClick={handleChangeSend}>
                        Enviar
                   </Button>
    </div>
    );
};

export default Card;
