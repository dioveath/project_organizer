
var ctx = document.getElementById("myPieChart").getContext("2d");

const DATA_COUNT = 5;

// const actions = [
//   {
//     name: 'Randomize',
//     handler(chart) {
//       chart.data.datasets.forEach(dataset => {
//         dataset.data = generateData();
//       });
//       chart.update();
//     }
//   },
//   {
//     name: 'Toggle Doughnut View',
//     handler(chart) {
//       if (chart.options.cutout) {
//         chart.options.cutout = 0;
//       } else {
//         chart.options.cutout = '50%';
//       }
//       chart.update();
//     }
//   }
// ];


var config = {
  type: 'pie',
  data: {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [{
      label: "HellO label",
      data: [1, 2, 3, 4, 56],
      backgroundColor: [
	'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
	'rgba(244, 99, 132, 1)', 
      ],
      borderWidth: 0.5, 
    }]
  }, 
  options: {
    plugins: {
      legend: true,
      tooltip: false, 
    },
    elements: {
      arc: {
        // backgroundColor: "#FFFF00"
        // hoverBackgroundColor: hoverColorize
      }
    }
  }
};


var pieChart = new Chart(ctx, config);
