import "./style.css";

import van from "vanjs-core";

// import { Counter } from "./counter";
import { Chart } from "./chart";

const { div, h1, p, button, input } = van.tags;
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
  // var growthRate = 1 + (0.05 / 60);
  // (() => {
  //   var newData: [number,number][] = [[0, 100.0]];
  //   for (let i = 1; i < 2; i++) {
  //     newData.push([i, newData[i - 1][1] * growthRate]);
  //   }
  //   MoneyData.val = newData;
  // })();

  const uiDaysToSimCount = van.state<number>(1);
  const uiShowDebugData = van.state<boolean>(false);

  const InitialMarketCap = van.state<number>(100);
  /**
   * data is x/y pairs of [day, market cap in $T]
   * -> there are 60 days in a year
   */
  const MoneyData = van.state<[number,number][]>([[0, InitialMarketCap.val]]);
  /** yearly growth rate, as a percentage */
  const YearlyGrowthRate = van.state<number>(5);

  const TickSim = (dayCount: number = 1) => {
    console.log("TickSim", dayCount);
    for (let i = 0; i < dayCount; i++) {
      let isNewYear = (MoneyData.val.length % 60) === 0;
      if (isNewYear) {
        console.log("New Year!");
      }
      let dataValToAdd: [number,number] = [MoneyData.val.length, MoneyData.val[MoneyData.val.length - 1][1] * (1 + ((YearlyGrowthRate.val / 100) / 60))];
      MoneyData.val = [...MoneyData.val, dataValToAdd];
    }
  };
  const ResetSim = () => {
    MoneyData.val = [[0, InitialMarketCap.val]]
  };

  return div(
    h1(
      "Work Sim 1980 Design Tool"
    ),
    p(
      { class: "title-text" },
      "Used for visualizing and tuning design data for Work Sim 1980."
    ),
    div(
      "Initial Market Cap: $",
      input(
        {
          type: "number",
          value: InitialMarketCap.val,
          oninput: (e) => InitialMarketCap.val = parseInt((e.target as HTMLInputElement).value),
        },
      ),
      "T",
    ),
    div(
      "Yearly Growth Rate: ",
      input(
        {
          type: "number",
          value: YearlyGrowthRate.val,
          oninput: (e) => YearlyGrowthRate.val = parseFloat((e.target as HTMLInputElement).value),
        },
      ),
      "%",
    ),
    div(
      input(
        {
          type: "number",
          value: uiDaysToSimCount.val,
          oninput: (e) => uiDaysToSimCount.val = parseInt((e.target as HTMLInputElement).value)
        },
      ),
      " => ",
      button(
        {
          onclick: () => TickSim(uiDaysToSimCount.val),
          textContent: () => (`Simulate ${uiDaysToSimCount.val} Days`)
        },
      ),
      button(
        { onclick: ResetSim },
        "Reset",
      )
    ),
    () => SimChart(MoneyData.val),
    p(),
    div(
      button(
        { onclick: () => uiShowDebugData.val = !uiShowDebugData.val },
        () => (((uiShowDebugData.val) ? "- Hide" : "+ Show") + " Debug Data"),
      ),
      p(),
      div(
        {
          style: () => (
            `display: ${uiShowDebugData.val ? "block" : "none"}; ` +
            "background-color: #eee; " +
            "padding: 1rem; " +
            "border-radius: 0.5rem; " +
            "font-family: monospace; " +
            "white-space: pre;"
          )
        },
        () => "MoneyData = " + JSON.stringify(MoneyData.val)
      ),
    ),
  );
};

van.add(app, Main());
