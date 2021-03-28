import React, { useEffect , useState} from 'react';
import ApiRequest from '../../util/ApiRequest'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chart from 'chart.js';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
//import  useState  from 'react-usestateref'
import './_shared.css';

const Card = () => {

    const useStyles = makeStyles((theme) => ({
        button: {
            '& > *': {
                margin: 20,
                color: 'withe',
                display: 'inline-block',

            },
        },
        text_box: {
            '& > *': {
                margin: theme.spacing(0.5),
                width: '25ch',
                display: 'inline-block',

            },
        },
        input_label: {
            '& > *': {
                margin: theme.spacing(1),
                minWidth: 195,
                display: 'inline-block',

            },
        },

    }));

    const classes = useStyles();

    const [datos, setDatos] = useState(null);
    const [intervalo, setIntervalo] = useState('');
    const [chart, setChart] = useState(null);
    const [n, setN ] = useState(null);
    const [x, setX ] = useState(null);
    const [k, setK ] = useState(null);
    const [c, setC ] = useState(null);
    const [g, setG ] = useState(null);
    const [enviar, setEnviar] = useState(false);

    const handleChangeN = (event) => setN( event.target.value);
    const handleChangeX = (event) => setX( event.target.value);
    const handleChangeK = (event) => setK( event.target.value);
    const handleChangeG = (event) => setG( event.target.value);
    const handleChangeC = (event) => setC( event.target.value);
    const handleChange = (event) => setIntervalo(event.target.value);
    const handleChangeSend = () => setEnviar(true);

    useEffect(() => {
        console.log(enviar);
        console.log(datos);
        if(enviar === true) llamartApi();
        setEnviar(false);
        if(datos != null) drawChart() ;

    }, [enviar, datos])

    function llamartApi () {

        ApiRequest.get(`/congruencial-lineal`, {n:  n, x: x, k: k, c: c, g: g, intervalos: intervalo})
            .then(async ({ data }) => {
            let tableData = data.map(dato => JSON.parse(dato)).map(d => {
                return [d.frecuencia ? d.frecuencia : 0, d.cota_superior ]
            });

            let tableDataList = [...tableData]
            console.log(tableDataList);
            setDatos(tableDataList)

        })
    }


     function drawChart() {

         let ctx = document.getElementById('myChart');
         if (chart) chart.destroy()
         setChart(
         new Chart(ctx, {
             type: 'bar',
             data: {
                 labels: datos?.map(d => d[1]),
                 datasets: [{
                     label: 'Cantidad de valores pseudoaleatorios por Intervalo',
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
         }) );
    }


    return (
        <div>
            <div>
            <FormControl className={classes.input_label} >
            <InputLabel  id="demo-simple-select-label">Intervalos</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={intervalo}
              onChange={handleChange}
              style={{ width: 100 }}
              >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
            </FormControl>
            </div>
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


            <div style={{ textAlign: '-webkit-center'} }>
                <canvas id="myChart" className="chart" width="400" height="400"></canvas>
            </div>


        </div>

    );
};

export default Card;
