import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import "../../styles/apexchart_custom.css"
import { millify } from 'millify';

const BarChart = React.memo(({ 
  data1, 
  data2, 
  label1, 
  label2, 
  categories, 
  vertical 
}) => {
  
  const options = useMemo(() => ({
    stroke: {
      width: 1, 
      colors: ['#000000'] 
    },

    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false}, 
      animations: { enabled: true }, 
      sparkline: { enabled: false }
    },

    states: {
      hover: {
        filter: {
          type: "none"
        }
      },
      active: {
        filter: {
          type: 'none'  
        }
      }
    },

    plotOptions: {
      bar: {
        horizontal: vertical ? false : true,
        columnWidth: '50%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top'
        }
      },
    },

    dataLabels: {
      enabled: false, 
    },

    legend: {
      position: 'bottom',
      onItemClick: {
        toggleDataSeries: false
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
          return millify(val).toString();
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
  }), [ categories, vertical]); 

  const series = useMemo(() => [
    {
      name: label1,
      data: data1,
    },
    {
      name: label2,
      data: data2,
    },
  ], [data1, data2, label1, label2]);

  return (
    <Chart 
      options={options} 
      series={series} 
      type="bar" 
      height={350} 
    />
  );
}, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.data1) === JSON.stringify(nextProps.data1) &&
    JSON.stringify(prevProps.data2) === JSON.stringify(nextProps.data2) &&
    JSON.stringify(prevProps.categories) === JSON.stringify(nextProps.categories) &&
    prevProps.label1 === nextProps.label1 &&
    prevProps.label2 === nextProps.label2 &&
    prevProps.vertical === nextProps.vertical
  );
});


export default BarChart