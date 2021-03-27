import React, { useEffect, useState } from 'react';
import ApiRequest from '../../util/ApiRequest'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chart from 'chart.js';
import './_shared.css';

const Card = () => {

    const [datos, setDatos] = useState(null);
   
window.google.charts.load('current', { packages: ['corechart'] });
window.google.charts.setOnLoadCallback(drawChart);


    function drawChart() {
        var myChart
        var ctx = document.getElementById('myChart');
        myChart?.destroy();
        myChart= new Chart(ctx, {
          type: 'bar',
          data: {
              labels: datos?.map(d => d[1]),
              datasets: [{
                  label: '# of Votes',
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

    const [interval, setInterval] = React.useState('');
    
      const handleChange = (event) => {
        setInterval(event.target.value);
        console.log(interval)
        ApiRequest.get(`/congruencial-lineal`, {n: 1000, x: 6, k: 3, c: 7, g:3, intervalos: event.target.value}).then(async ({ data }) => {
            let tableData = data.map(dato => JSON.parse(dato)).map(d => {
                return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
            });
    
            let tableDataList = [...tableData]
            console.log(tableDataList);
            setDatos(tableDataList)
        })
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
