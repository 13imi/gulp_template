var inputBirthday = $('[data-id="inputBirthday"]');
var inputTwins = $('[data-id="inputTwins"]');
var inputMonthlyAllSalary = $('[data-id="inputMonthlyAllSalary"]');
var inputMonthlySalary = $('[data-id="inputMonthlySalary"]');
var birthDay = $('[data-id="birthDay"]');
var papaIkukyuStart = $('[data-id="papaIkukyuStart"]');
var papaIkukyuEnd = $('[data-id="papaIkukyuEnd"]');
var mamaBeforeSankyuStart = $('[data-id="mamaBeforeSankyuStart"]');
var mamaBeforeSankyuEnd = $('[data-id="mamaBeforeSankyuEnd"]');
var mamaAfterSankyuStart = $('[data-id="mamaAfterSankyuStart"]');
var mamaAfterSankyuEnd = $('[data-id="mamaAfterSankyuEnd"]');
var mamaIkukyuStart = $('[data-id="mamaIkukyuStart"]');
var mamaIkukyuEnd = $('[data-id="mamaIkukyuEnd"]');
var startSimButton = $('[data-id="startSim"]');
var allSalary = $('[data-id="allSalary"]');
var childTime = $('[data-id="childTime"]');
var childTimeMonth = $('[data-id="childTimeMonth"]');

inputBirthday.on('change', function() {
    /* cal();*/
});

inputTwins.on('change', function() {
    /* cal();*/
});

startSimButton.on('click', function() {
    cal();
});

function cal() {
    var birthDate = moment(inputBirthday.val());

    var monthlyAllSalary = inputMonthlyAllSalary.val();
    var monthlySalary = inputMonthlySalary.val();

    var papaIkukyuStartDate = moment(inputBirthday.val());
    var papaIkukyuEndDate = moment(inputBirthday.val()).add(1, "y").add(-1, "d");

    if (inputTwins.prop('checked')) {
        var mamaBeforeSankyuStartDate = moment(inputBirthday.val()).add(-97, "d");
    } else {
        var mamaBeforeSankyuStartDate = moment(inputBirthday.val()).add(-41, "d");
    }

    var mamaAfterSankyuStartDate = moment(inputBirthday.val()).add(1, "d");
    var mamaAfterSankyuEndDate = moment(inputBirthday.val()).add(56, "d");
    var mamaIkukyuStartDate = moment(inputBirthday.val()).add(57, "d");
    var mamaIkukyuEndDate = moment(inputBirthday.val()).add(1, "y").add(-1, "d");

    graph(papaIkukyuStartDate, papaIkukyuEndDate, monthlyAllSalary, monthlySalary);

    birthDay.text(birthDate.format("YYYY年M月D日"));
    papaIkukyuStart.text(papaIkukyuStartDate.format("YYYY年M月D日"));
    papaIkukyuEnd.text(papaIkukyuEndDate.format("YYYY年MM月D日"));
    mamaBeforeSankyuStart.text(mamaBeforeSankyuStartDate.format("YYYY年M月D日"));
    mamaBeforeSankyuEnd.text(birthDate.format("YYYY年M月D日"));
    mamaAfterSankyuStart.text(mamaAfterSankyuStartDate.format("YYYY年M月D日"));
    mamaAfterSankyuEnd.text(mamaAfterSankyuEndDate.format("YYYY年M月D日"));
    mamaIkukyuStart.text(mamaIkukyuStartDate.format("YYYY年MM月D日"));
    mamaIkukyuEnd.text(mamaIkukyuEndDate.format("YYYY年MM月D日"));

    allSalary.text(salaryPercentage(monthlyAllSalary, monthlySalary));
    childTime.text(withChildTime());
    childTimeMonth.text(withChildTime()/24);
}

var chartOptions =
    {
        chartArea: {
        },
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    // 目盛をコンマ＆円表記
                    callback: function(value, index, values) {
                        // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +' 円';
                        return addCommaYen(value);
                    }
                },
                gridLines: {
                    display: true,
                    color: "#eeeeee",
                    drawBorder: false
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data){
                    return addCommaYen(tooltipItem.yLabel);
                }
            }
        }
    }

var chartOptions2 =
    {
        chartArea: {
        },
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    // 目盛をコンマ＆円表記
                    callback: function(value, index, values) {
                        return value + "時間";
                    }
                },
                gridLines: {
                    display: true,
                    color: "#eeeeee",
                    drawBorder: false
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data){
                    return tooltipItem.yLabel + "時間";
                }
            }
        }
    }

var pieChartOptions =
    {
        cutoutPercentage: 50,
        maintainAspectRatio: false,
    }

window.onload = function() {
    ctx = document.getElementById("canvas").getContext("2d");
    window.myBar = new Chart(ctx, {
        type: 'bar', // ここは bar にする必要があります
        data: barChartData,
        options: chartOptions
    });

    ctx2 = document.getElementById("canvas-2").getContext("2d");
    window.myPieChart = new Chart(ctx2, {
        type: 'pie', // ここは bar にする必要があります
        data: pieChartData,
        options: pieChartOptions
    });

    ctx3 = document.getElementById("canvas-3").getContext("2d");
    window.myBar2 = new Chart(ctx3, {
        type: 'bar', // ここは bar にする必要があります
        data: barChartData2,
        options: chartOptions2
    });
};

function graph(start, end, monthlyAllSalary, monthlySalary) {
    ctx = document.getElementById("canvas").getContext("2d");
    window.myBar.data = salaryData(start, monthlyAllSalary);
    window.myBar.update();
    window.myBar2.data = withChildTimeData();
    window.myBar2.update();
    window.myPieChart.data = salaryPercentageData(monthlyAllSalary, monthlySalary);
    window.myPieChart.update();
}

function salaryPercentage(allSalary, salary) {
    var salary67 = allSalary * 0.67;
    var salary50 = allSalary * 0.50;

    return ((salary67 * 6 + salary50 * 6) / (salary * 12)) * 100;
}

function salaryPercentageData(allSalary, salary) {
    var salary67 = allSalary * 0.67;
    var salary50 = allSalary * 0.50;
    var yearSalary = salary67 * 6 + salary50 * 6;

    return {
        datasets: [{
            data: [yearSalary, salary * 12 - yearSalary],
            backgroundColor: ["rgba(254,97,132,0.5)", "#dddddd"]
        }],

        // これらのラベルは凡例とツールチップに表示されます。
        labels: [
            '育児休業給付金',
            '減るお金'
        ]
    };
}

function withChildTime(){
    return 9 * 20 * 12;
}

function withChildTimeData(){
    return  {
        labels: ['休まない','休む'],
        datasets: [
            {
                label: '時間',
                data: [7 * 20 * 12, 16 * 20 * 12],
                borderColor : "rgba(254,97,132,0.8)",
                backgroundColor : "rgba(254,97,132,0.5)"
            }
        ]
    };
}

function salaryData(start, salary) {
    var salary67x2 = salary * 0.67 * 2;
    var salary50x2 = salary * 0.50 * 2;

    var barChartData = {
        labels: [
            start.format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月"),
            start.add(1, "M").format("M月")
        ],
        datasets: [
            {
                label: '育児休業給付金',
                data: [
                    '0',
                    '0',
                    salary67x2,
                    '0',
                    salary67x2,
                    '0',
                    salary67x2,
                    '0',
                    salary50x2,
                    '0',
                    salary50x2,
                    '0',
                    salary50x2
                ],
                borderColor : "rgba(254,97,132,0.8)",
                backgroundColor : "rgba(254,97,132,0.5)",
            }
            /* {
             *     label: 'sample-bar',
             *     data: [
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary,
             *         salary
             *     ],
             *     borderColor : "rgba(0,0,0,0.2)",
             *     backgroundColor : "rgba(0,0,0,0.1)",
             * },*/
        ]
    };
    return barChartData;
}

function addCommaYen(item) {
    return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +' 円';
}

// とある4週間分のデータログ
var barChartData = {
    labels: ['5月','6月','7月','8月','9月','10月'
            ],
    datasets: [
        {
            label: 'サンプル',
            data: ['240000','240000','240000','240000','240000','240000'
                  ],
            borderColor : "rgba(254,97,132,0.8)",
            backgroundColor : "rgba(254,97,132,0.5)",
        },
        {
            label: 'サンプル',
            data: ['210000','210000','210000','210000','210000','210000'
                  ],
            borderColor : "rgba(54,164,235,0.8)",
            backgroundColor : "rgba(54,164,235,0.5)"
        },
    ]
};

var barChartData2 = {
    labels: ['このまま','育休'],
    datasets: [
        {
            label: '時間',
            data: ['1000','2000'],
            borderColor : "rgba(254,97,132,0.8)",
            backgroundColor : "rgba(254,97,132,0.5)"
        }
    ]
};

var pieChartData = {
    datasets: [{
        data: [10, 20],
        backgroundColor: ["rgba(254,97,132,0.5)", "#dddddd"]
    }],

    // これらのラベルは凡例とツールチップに表示されます。
    labels: [
        'Red',
        'Yellow'
    ]
};
