import React, { useEffect, useState } from 'react';
import ApiRequest from '../../util/ApiRequest'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chart from 'chart.js';
import './_shared.css';

const Card = () => {
    
    const [interval, setInterval] = React.useState('');
    const [datos, setDatos] = useState(null);
    window.google.charts.load('current', { packages: ['corechart'] });
    useEffect(()=> {
    window.google.charts.setOnLoadCallback(drawChart);
}, []);


const [chart, setChart] = useState(null);
function drawChart() {
    var ctx = document.getElementById('myChart');
    chart?.destroy()
    setChart(new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos?.map(d => d[1]),
            datasets: [{
                label: 'Frecuencias',
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
    }));
}

useEffect(()=> {
    ApiRequest.get(`/full-random`, {n: 1000, intervalos: interval}).then(async ({ data }) => {
        console.log(data);
        let tableData = data.map(dato => JSON.parse(dato)).map(d => {
            return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
        });
        
        let tableDataList = [...tableData]
        setDatos(tableDataList);
    })
    }, [interval])

useEffect(()=> {
    drawChart();
}, [datos])

const handleChange = (event) => {
    setInterval(event.target.value);
    /* ApiRequest.get(`/congruencial-lineal`, {n: 1000, x: 6, k: 3, c: 7, g:3, intervalos: event.target.value}).then(async ({ data }) => {
        let tableData = data.map(dato => JSON.parse(dato)).map(d => {
            return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
        });
        
        let tableDataList = [...tableData]
        setDatos(tableDataList);
    })  */
        /* ApiRequest.get(`/congruencial-multiplicativo`, {n: 1000, x: 17, k: 2, g:5, intervalos: event.target.value}).then(async ({ data }) => {
            let tableData = data.map(dato => JSON.parse(dato)).map(d => {
                return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
            });
            
            let tableDataList = [...tableData]
            setDatos(tableDataList);
        }) */
        
      };

    return (
        <div style={{ textAlign: '-webkit-center' }}>
            <canvas id="myChart" className="chart" width="400" height="400"></canvas>
            <FormControl>
            <InputLabel id="demo-simple-select-label">Intervalos</InputLabel>

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
    );
};

export default Card;
