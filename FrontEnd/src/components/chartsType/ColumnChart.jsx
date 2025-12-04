import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import "../../styles/apexchart_custom.css"

const ColumnChart = React.memo(({ 
  data1, 
  data2, 
  label1, 
  label2, 
  categories, 
  vertical, 
  w 
}) => {
  


  const options = useMemo(() => ({
    stroke: {
      width:  1,
      colors: ['#000000'] 
    },

    chart: {
      type: 'bar',
      stacked: true,
      stackType: "100%",
      toolbar: { show: false }, 
      animations: {
        enabled: true,
        speed: 450,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },

    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        filter: {
          type: 'none'  
        }
      }
    },

    dataLabels: {
      enabled: false, 
    },

    plotOptions: {
      bar: {
        horizontal: vertical ? false : true,
        columnWidth: vertical ? '50%' : '30%',
        endingShape: 'rounded',
      },
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
          return (val).toString() + '%';
        }
      }
    },
    
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff', 
          fontSize:  (w < 600 ? '10px' : '12px') 
        }
      }
    },

    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#ffffff', 
          fontSize:  (w < 600 ? '10px' : '12px')
        }
      }
    },
  }), [categories, vertical, w]); 


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
    prevProps.vertical === nextProps.vertical &&
    prevProps.w === nextProps.w
  );
});

export default ColumnChart;
