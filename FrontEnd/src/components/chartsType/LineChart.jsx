import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import "../../styles/apexchart_custom.css"
import { millify } from 'millify';

const LineChart = React.memo(({ 
  data1, 
  label1, 
  data2, 
  label2, 
  categories, 
  active 
}) => {
  

  const options = useMemo(() => ({
    stroke: {
      width:  2, 
      colors: ["#0055ffff", "#13d11dff"],
      curve: "smooth",
    },
    
    markers: {
      size: 1,
    },

    chart: {
      type: "line",
      height: "100%",
      zoom: {
        enabled: false, 
      },
      redrawOnParentResize: true,
      toolbar: { show: false},
      animations: {
        enabled: true,
        speed: 200,
        animateGradually: {
          enabled: true,
          delay: 50
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },


    legend: {
      position: "bottom",
      onItemClick: {
        toggleDataSeries: false,
      },
      onItemHover: {
        highlightDataSeries: true, 
      },
      labels: {
        colors: ["#ffffff", "#ffffff"],
      },
    },

    tooltip: {
      theme: "dark",
      enabled: active, 
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return millify(val).toString();
        },
      },
    },

    yaxis: {
      labels: {
        style: {
          colors: "#ffffff",
          fontSize: "12px",
        },
      },
    },

    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#ffffff",
          fontSize: "12px",
        },
      },
    },
  }), [ active, categories]); 


  const series = useMemo(() => [
    {
      name: label1,
      data: data1,
      show: !data1
    },
    {
      name: label2,
      data: data2,
      show: !data2,
    }
  ], [data1, data2, label1, label2]);

  return (
    <Chart 
      options={options} 
      series={series} 
      type="line" 
      height="100%" 
    />
  );
}, (prevProps, nextProps) => {

  return (
    JSON.stringify(prevProps.data1) === JSON.stringify(nextProps.data1) &&
    JSON.stringify(prevProps.data2) === JSON.stringify(nextProps.data2) &&
    JSON.stringify(prevProps.categories) === JSON.stringify(nextProps.categories) &&
    prevProps.label1 === nextProps.label1 &&
    prevProps.label2 === nextProps.label2 &&
    prevProps.active === nextProps.active
  );
});

export default LineChart;
