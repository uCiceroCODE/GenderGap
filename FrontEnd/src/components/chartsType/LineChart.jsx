import React from "react";
import Chart from "react-apexcharts";
import "../../styles/apexchart_custom.css"
import { millify } from 'millify';

const LineChart = ({data1, label1, data2, label2, categories, active}) => {
  const options = {
    stroke: {
      width: 2,
      colors: ["#0055ffff", "#13d11dff"],
      curve: "smooth",
    },
    markers: {
      size: 1,
    },

    chart: {
      type: "bar",
      height: "100%",
      zoom: {
        enabled: false,
      },
      redrawOnParentResize: true
    },

    dataLabels: {
      enabled: false,
      style: {
        colors: ["#000"],
      },
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
  };

  const series = [
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
  ];

  return <Chart options={options} series={series} type="line" height="100%" />;
};

export default LineChart;
