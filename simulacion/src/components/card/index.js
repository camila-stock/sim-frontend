import React, { useState } from 'react';
import ApiRequest from '../../util/ApiRequest'

const Card = () => {

    const [datos, setDatos] = useState(null);

    //TODO: Agregar en un useEfect para que no haga requests en loop
    ApiRequest.get(`/histogram`).then(async ({ data }) => {
        console.log("data: " , data);
        setDatos(data)
    });

    console.log("datos: " , datos);


    window.google.charts.load('current', { packages: ['corechart'] });
    window.google.charts.setOnLoadCallback(drawChart);


    function drawChart() {

        var data = window.google.visualization.arrayToDataTable(datos);


        var view = new window.google.visualization.DataView(data);

        var options = {
            title: 'Lengths of dinosaurs, in meters',
            legend: { position: 'none' },
        };

        var chart = new window.google.visualization.Histogram(document.getElementById('chart_div'));
        chart.draw(view, options);
    }

    return (
        <div style={{ textAlign: '-webkit-center' }}>
            <div id="chart_div" style={{ width: 800, height: 400 }} />
        </div>
    );
};

export default Card;
