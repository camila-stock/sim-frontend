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
    const [table, setTable] = useState([]);
    const [n, setN] = useState(null);
    const [a, setA] = useState(null);
    const [b, setB] = useState(null);
    const [lambda, setLambda] = useState(null);
    const [media, setMedia] = useState(null);
    const [desviacion, setDesviacion] = useState(null);
    window.google.charts.load('current', { packages: ['corechart'] });


    const [chart, setChart] = useState(null);
    const [method, setMethod] = useState(null);

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

    const handleChangeTable = (event) => {
        setTable(event.target.value);
      };

      const handleChangeA = (event) => {
        setA(event.target.value);
      };

      const handleChangeB = (event) => {
        setB(event.target.value);
      };

      const handleChangeLambda = (event) => {
        setLambda(event.target.value);
      };

      const handleChangeMedia = (event) => {
        setMedia(event.target.value);
      };

      const handleChangeDesviacion = (event) => {
        setDesviacion(event.target.value);
      };

      const parseData = (data) => {
        let chartData = data.chart.map(dato => JSON.parse(dato)).map(d => [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]);
                    let numbersData = data.numbers.map((dato, i) => ({ value: dato, number: i}))
                    let tableData = data.table.map(dato => JSON.parse(dato)).map(dato => ({
                        intervalo : dato.intervalo ? dato.intervalo :0,
                        fo: dato.fo ? dato.fo  : 0,
                        fe: dato.fe ? dato.fe : 0,
                    }));
                    setDatos([...chartData]);
                    setDatosNumbers([...numbersData]);
                    setTable([...tableData])
      }

      const handleChangeSend = (event) => {
        switch (method) {
            case 'uniforme-a-b':
                ApiRequest.get('/uniforme-a-b', {a, b, n, intervalos: interval}).then(async ({ data }) => {
                    parseData(data)
                })
                break;
            case 'exponencial':
                ApiRequest.get(`/exponencial`, {n, lambda, intervalos: interval}).then(async ({ data }) => {
                    parseData(data)
                })
                break;
            case 'normal':
                ApiRequest.get(`/normal`, {n, media, desviacion, intervalos: interval}).then(async ({ data }) => {
                    parseData(data)
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
              <MenuItem value={'uniforme-a-b'}>Uniforme a b</MenuItem>
              <MenuItem value={'exponencial'}>Exponencial</MenuItem>
              <MenuItem value={'normal'}>Normal</MenuItem>
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
            <TextField id="outlined-basic" label="Valor de A" variant="outlined" value={a} onChange={handleChangeA}/>
            <TextField id="outlined-basic" label="Valor de B" variant="outlined" value={b} onChange={handleChangeB}/>
            <TextField id="outlined-basic" label="Valor de Lambda" variant="outlined" value={lambda} onChange={handleChangeLambda}/>
            <TextField id="outlined-basic" label="Valor de Media" variant="outlined" value={media} onChange={handleChangeMedia}/>
            <TextField id="outlined-basic" label="Valor de Desviacion" variant="outlined" value={desviacion} onChange={handleChangeDesviacion}/>
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
        title="Datos"
        columns={[
            { title: 'intervalo', field: 'intervalo' },
            { title: 'fo', field: 'fo' },
            { title: 'fe', field: 'fe' },
          ]}
        data={table}
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
        options={{search: false,paging: true, rowStyle: {
            'font-family': 'Roboto,Helvetica Neue,sans-serif',
            'font-size': '14px',
            'color': 'rgba(0, 0, 0, 0.54)'
          }}}
        title="Numeros generados aleat."
        columns={[
            { title: 'nro', field: 'number' },
            { title: 'valor', field: 'value' },
          ]}
        data={datosNumbers}
      />
        </React.Fragment>
    </div>
    );
};

export default Card;
