import React from "react";
import Chart from "react-apexcharts";
import "../../styles/apexchart_custom.css"

const ColumnChart = ({data1, data2, label1, label2, categories, vertical}) => {
  const options = {
    stroke: {
      width: 1, 
      colors: ['#000000'] 
    },

    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: "100%"
    },

    states: {
      hover: {
        filter: {
          
        }
      },
      active: {
        filter: {
          
        }
      }
    },

    plotOptions: {
      bar: {
        horizontal: vertical ? false : true,
        columnWidth: '50%',
        endingShape: 'rounded',
      },
    },


    dataLabels: {
      enabled: false,
      style: {
      colors: ['#000']
    }
    },


    legend: {
      position: 'bottom',
       onItemClick: {
      toggleDataSeries: true
    },
      labels: {
      colors: ['#ffffff', '#ffffff']
    }
    },


    tooltip: {
      theme: 'dark',
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return (val).toString() + '%';
        }
      }
    },
    
    yaxis: {

      labels: {
      style: {
        colors: '#ffffff', 
        fontSize: '12px'
      }
    }
    },

    xaxis: {
      categories: categories,

      labels: {
      style: {
        colors: '#ffffff', 
        fontSize: '12px'
      }
    }
    },
  };

  const series = [
    {
      name: label1,
      data: data1,
    },
    {
      name: label2,
      data: data2,
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default ColumnChart;
