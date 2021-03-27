import React, { useEffect, useState } from 'react';
import ApiRequest from '../../util/ApiRequest'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chart from 'chart.js'
const Card = () => {

    const [datos, setDatos] = useState(null);
    useEffect(ApiRequest.get(`/histogram`).then(async ({ data }) => {
        //console.log("data: " , data);
        setDatos(data)
    }));
  
 
    //console.log("datos: " , datos);
/*     ApiRequest.get(`/congruencial-lineal`, {n: 10, x: 6, k: 3, c: 7, g:3, intervalos: 10}).then(async ({ data }) => {
        let tableData = data.map(dato => JSON.parse(dato)).map(d => {
            return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
        });

        let tableDataList = [['Frecuencia','Cota Superior'], ...tableData]
        console.log(tableDataList);
        setDatos(tableDataList)
    });
 */
    //console.log("datos: " , datos);

    window.google.charts.load('current', { packages: ['corechart'] });
    window.google.charts.setOnLoadCallback(drawChart);


    function drawChart() {

        /* var data = window.google.visualization.arrayToDataTable(datos);


        var view = new window.google.visualization.DataView(data);

        var options = {
            title: 'Lengths of dinosaurs, in meters',
            legend: { position: 'none' },
        };

        var chart = new window.google.visualization.Histogram(document.getElementById('chart_div'));
        chart.draw(view, options); */
        var ctx = document.getElementById('myChart');
      console.log(ctx);
      var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
              datasets: [{
                  label: '# of Votes',
                  data: [12, 19, 3, 5, 2, 3],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
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
      };

    return (
        <div style={{ textAlign: '-webkit-center' }}>
            <canvas id="myChart" width="400" height="400"></canvas>
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
