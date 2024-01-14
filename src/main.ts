import "./style.css";

import van, { State } from "vanjs-core";

// import { Counter } from "./counter";
import { Chart } from "./chart";

const { div, h1, p, button, code } = van.tags;
const app = document.querySelector<HTMLDivElement>("#app")!;


const SimChart = (chartData: [number,number][]) => {
  const unzip = (arr: [number, number][]) => {
    const xs: number[] = [];
    const ys: number[] = [];
    arr.forEach(([x, y]) => {
      xs.push(x);
      ys.push(y);
    });
    return [xs, ys];
  }
  const [xList, yList] = unzip(van.val(chartData));

  return Chart({
    type: "line",
    data: {
      labels: xList,
      datasets: [
        {
          label: "Global Market Cap ($T)",
          backgroundColor: "#0eee8c",
          borderColor: "#0eee8c",
          data: yList,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Day",
          },
        },
        y: {
          title: {
            display: true,
            text: "Market Cap ($T)"
          },
          beginAtZero: false,
          ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, _index, _ticks) {
              // we want value to be rounded to 3 decimal places
              // 1.23456789 -> 1.235
              return "$" + (value as number).toFixed(3) + "T";
            },
          },
        },
      },
    },
  });
};


const Main = () => {
  // data is x/y pairs of [day, market cap in $T]
  // there are 60 days in a year
  var data = van.state<[number,number][]>([]);
  var growthRate = 1 + (0.05 / 60);
  (() => {
    var newData: [number,number][] = [[0, 100.0]];
    for (let i = 1; i < 2; i++) {
      newData.push([i, newData[i - 1][1] * growthRate]);
    }
    data.val = newData;
  })();

  const addData = () => {
    let dataValToAdd: [number,number] = [data.val.length, data.val[data.val.length - 1][1] * growthRate];
    data.val = [...data.val, dataValToAdd];
    // console.log(`Added data: ${dataValToAdd} | data len = ${data.val.length}`);
  };

  return div(
    h1(
      "Work Sim 1980 Design Tool"
    ),
    p(
      { class: "title-text" },
      "Used for visualizing and tuning design data for Work Sim 1980."
    ),
    button(
      { onclick: addData },
      "Add Data"
    ),
    SimChart(data.val),
    p(),
    code(
      { textContent: () => ("data = " + JSON.stringify(data.val)) }
    ),
  );
};

van.add(app, Main());
