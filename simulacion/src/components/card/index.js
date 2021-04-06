import React, { useEffect, useState, forwardRef } from 'react';
import ApiRequest from '../../util/ApiRequest'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import Chart from 'chart.js';
import './_shared.css';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

const Card = () => {

    const tableIcons = {
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ArrowDownward: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
      };

    const [interval, setInterval] = React.useState('');
    const [datos, setDatos] = useState(null);
    const [datosNumbers, setDatosNumbers] = useState([]);
    const [datosChi, setDatosChi] = useState([]);
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
                    let chartData = data.chart.map(dato => JSON.parse(dato)).map(d => [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]);
                    let tableData = data.table.map(dato => JSON.parse(dato)).map(dato => ({
                        intervalo : dato.intervalo ? dato.intervalo.toFixed(4) :0,
                        fo: dato.fo ? dato.fo  : 0,
                        fe: dato.fe ? dato.fe.toFixed(4) : 0,
                        C: dato.C ? dato.C.toFixed(4) : 0,
                        CA: dato.CA ? dato.CA.toFixed(4) : 0
                    }));
                    let numbersData = data.numbers.map((dato, i) => ({ value: dato, number: i}))
                    setDatos([...chartData]);
                    setDatosNumbers([...numbersData]);
                    setDatosChi(tableData);
                })
                break;
            case 'congruencial-lineal':
                ApiRequest.get(`/congruencial-lineal`, {n, x, k, c, g, intervalos: interval}).then(async ({ data }) => {
                    let chartData = data.chart.map(dato => JSON.parse(dato)).map(d => [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]);
                    let tableData = data.table.map(dato => JSON.parse(dato)).map(dato => ({
                        intervalo : dato.intervalo ? dato.intervalo.toFixed(4) :0,
                        fo: dato.fo ? dato.fo : 0,
                        fe: dato.fe ? dato.fe.toFixed(4) : 0,
                        C: dato.C ? dato.C.toFixed(4) : 0,
                        CA: dato.CA ? dato.CA.toFixed(4): 0
                    }));
                    let numbersData = data.numbers.map((dato, i) => ({ value: dato, number: i}))
                    setDatosNumbers([...numbersData]);
                    setDatos([...chartData]);
                    setDatosChi(tableData);
                })
                break;
            case 'congruencial-multiplicativo':
                ApiRequest.get(`/congruencial-multiplicativo`, {n, x, k, g, intervalos: interval}).then(async ({ data }) => {
                    let chartData = data.chart.map(dato => JSON.parse(dato)).map(d => [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]);
                    let tableData = data.table.map(dato => JSON.parse(dato)).map(dato => ({
                        intervalo : dato.intervalo ? dato.intervalo.toFixed(4) :0,
                        fo: dato.fo ? dato.fo : 0,
                        fe: dato.fe ? dato.fe.toFixed(4) : 0,
                        C: dato.C ? dato.C.toFixed(4) : 0,
                        CA: dato.CA ? dato.CA.toFixed(4) : 0
                    }));
                    let numbersData = data.numbers.map((dato, i) => ({ value: dato, number: i}))
                    console.log(data.numbers.map((dato, i) => ({ value: dato, number: i})))
                    setDatos([...chartData]);
                    setDatosNumbers([...numbersData]);
                    setDatosChi(tableData);
                })    
                break;
            default:
                break;
        }
      };

    return (
        <div class="column">
            <div class="row">
            <div class="histogram">
                <canvas id="myChart" className="chart"></canvas>
                <span class="text">Intervalos</span>
            </div>
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
            <TextField id="outlined-basic" label="Tamaño de muestra (n)" variant="outlined" value={n} onChange={handleChangeN} />
            <TextField id="outlined-basic" label="Valor de la semilla (x)" variant="outlined" value={x} onChange={handleChangeX}/>
            <TextField id="outlined-basic" label="Valor de K" variant="outlined" value={k} onChange={handleChangeK}/>
            <TextField id="outlined-basic" label="Valor de G" variant="outlined" value={g} onChange={handleChangeG}/>
            <TextField id="outlined-basic" label="Valor de C" variant="outlined" value={c} onChange={handleChangeC}/>
        </div>
        <div class="row">
            <Button variant="contained" color="primary" onClick={handleChangeSend}>
                    Enviar
            </Button>
        </div>

        <React.Fragment>
        <MaterialTable
        icons={tableIcons}
        localization={{
            pagination: {
                labelRowsSelect: "filas",
                firstTooltip: "Primera Página",
                previousTooltip: "Página Anterior",
                nextTooltip: "Siguiente Página",
                lastTooltip: "Última Página"
            },
            body: {
                emptyDataSourceMessage: "No existen registros para mostrar.",
            }
        }}
        options={{search: false, rowStyle: {
            'font-family': 'Roboto,Helvetica Neue,sans-serif',
            'font-size': '14px',
            'color': 'rgba(0, 0, 0, 0.54)'
          }}}
        columns={[
            { title: 'intervalo', field: 'intervalo' },
            { title: 'fo', field: 'fo' },
            { title: 'fe', field: 'fe' },
            { title: 'C', field: 'C' },//, type: 'numeric'
            { title: 'CA', field: 'CA' },//, type: 'numeric'
          ]}
        data={datosChi}
      />
        </React.Fragment>
        <React.Fragment>
        <MaterialTable
        icons={tableIcons}
        localization={{
            pagination: {
                labelRowsSelect: "filas",
                firstTooltip: "Primera Página",
                previousTooltip: "Página Anterior",
                nextTooltip: "Siguiente Página",
                lastTooltip: "Última Página"
            },
            body: {
                emptyDataSourceMessage: "No existen registros para mostrar.",
            }
        }}
        options={{search: false, rowStyle: {
            'font-family': 'Roboto,Helvetica Neue,sans-serif',
            'font-size': '14px',
            'color': 'rgba(0, 0, 0, 0.54)'
          }}}
        columns={[
            { title: 'nro', field: 'number' },
            { title: 'value', field: 'value' },
          ]}
        data={datosNumbers}
      />
        </React.Fragment>
    </div>
    );
};

export default Card;
