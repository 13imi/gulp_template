var inputBirthday = $('[data-id="inputBirthday"]');
var inputTwins = $('[data-id="inputTwins"]');
var inputMonthlyAllSalary = $('[data-id="inputMonthlyAllSalary"]');
var inputMonthlySalary = $('[data-id="inputMonthlySalary"]');
var inputWorkTime =  $('[data-id="inputWorkTime"]');
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
var salaryTable = $('[data-id="salaryTable"]');
var kyufu = $('[data-id="kyufu"]');
var ikusimResults = $('[data-id="ikusimResults"]');
var exampleResultsH2 = $('[data-id="exampleResultsH2"]');
var resultsH2 = $('[data-id="resultsH2"]');
var canvasData = null;

var mainColor = "rgba(14,78,173,0.85)";
var accentColor = "rgba(255,152,0,0.8)";
var gradient0 = "#000046",
    gradient1 = "#1CB5E0";

// スムーススクロール
$(function(){
    $('button[href^="#"]').click(function() {
        var speed = 600;
        var href= $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        $('body,html').animate({scrollTop:position}, speed, 'swing');
        return false;
    });
});


inputBirthday.on('change', function() {
    /* cal();*/
});

inputTwins.on('change', function() {
    /* cal();*/
});

startSimButton.on('click', function() {
    ikusimResults.css({
        "opacity": "1.0",
        "pointer-events": "initial"
    });
    resultsH2.css("display", "block");
    exampleResultsH2.css("display", "none");
    cal();
});

function cal() {
    var birthDate = moment(inputBirthday.val());

    var monthlyAllSalary = inputMonthlyAllSalary.val();
    var monthlySalary = inputMonthlySalary.val();
    var workTime = inputWorkTime.val();

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

    birthDay.text(birthDate.format("YYYY年M月D日"));
    papaIkukyuStart.text(papaIkukyuStartDate.format("YYYY年M月D日"));
    papaIkukyuEnd.text(papaIkukyuEndDate.format("YYYY年MM月D日"));
    mamaBeforeSankyuStart.text(mamaBeforeSankyuStartDate.format("YYYY年M月D日"));
    mamaBeforeSankyuEnd.text(birthDate.format("YYYY年M月D日"));
    mamaAfterSankyuStart.text(mamaAfterSankyuStartDate.format("YYYY年M月D日"));
    mamaAfterSankyuEnd.text(mamaAfterSankyuEndDate.format("YYYY年M月D日"));
    mamaIkukyuStart.text(mamaIkukyuStartDate.format("YYYY年MM月D日"));
    mamaIkukyuEnd.text(mamaIkukyuEndDate.format("YYYY年MM月D日"));

    // 最低額、最高額をチェック
    if(monthlyAllSalary >= 447300) {
        monthlyAllSalary = 447300;
    } else if(monthlyAllSalary <= 74100) {
        monthlyAllSalary = 74100;
    }

    graph(papaIkukyuStartDate, papaIkukyuEndDate, monthlyAllSalary, monthlySalary, workTime);

    allSalary.text(salaryPercentage(monthlyAllSalary, monthlySalary));
    childTime.text(withChildTime(workTime));
    childTimeMonth.text(withChildTime(workTime)/24);
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
                    min: 0,
                    max: 4000,
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
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data){
                    return addCommaYen(data.datasets[0].data[tooltipItem.index]);
                }
            }
        }
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

function graph(start, end, monthlyAllSalary, monthlySalary, workTime) {
    window.myBar.data = salaryData(start, monthlyAllSalary);
    window.myBar.update();
    window.myBar2.data = withChildTimeData(workTime);
    window.myBar2.update();
    window.myPieChart.data = salaryPercentageData(monthlyAllSalary, monthlySalary);
    window.myPieChart.update();

    salaryTable.find("tbody").html("");
    $.each(window.myBar.data.detail_labels, function(index, data) {
        salaryTable.find("tbody").append('<tr><th scope="row">'+ this + '</th><td class="td2">' + addCommaYen(window.myBar.data.datasets[0].data[index]) + '</td><td class="td3">'+ addCommaYen(monthlySalary) + '</td></tr>');
    });

    setTimeout(function(){
        createImage("#capture", "ikusim-money");
        createImage("#capture2", "ikusim-childtime");
	  }, 500);

}

function createImage(element, btn) {
    html2canvas(document.querySelector(element)).then(canvas => {
        // document.body.appendChild(canvas);
        canvasData = canvas;
        document.getElementById(btn).href = canvasData.toDataURL();
    });
}

function salaryPercentage(allSalary, salary) {
    var salary67 = allSalary * 0.67;
    var salary50 = allSalary * 0.50;
    salaryTable.find("tbody").append('<tr><th scope="row">合計</th><td class="td2">' + addCommaYen(salary67 * 6 + salary50 * 6) + '</td><td class="td3">'+ addCommaYen(salary * 12) + '</td></tr>');


    return (((salary67 * 6 + salary50 * 6) / (salary * 12)) * 100).toFixed(1);
}

function salaryPercentageData(allSalary, salary) {
    var salary67 = allSalary * 0.67;
    var salary50 = allSalary * 0.50;
    var yearSalary = salary67 * 6 + salary50 * 6;
    kyufu.text(addCommaYen(yearSalary));

    return {
        datasets: [{
            data: [yearSalary, salary * 12 - yearSalary],
            backgroundColor: [mainColor, "#dddddd"]
        }],

        // これらのラベルは凡例とツールチップに表示されます。
        labels: [
            '育児休業給付金',
            '減るお金'
        ]
    };
}

function withChildTime(workTime){
    return workTime * 20 * 12;
}

function withChildTimeData(workTime){
    return  {
        labels: ['休まない','休む'],
        datasets: [
            {
                label: '子どもと過ごす時間',
                data: [(24 - 8 - workTime) * 20 * 12, (24 - 8) * 20 * 12],
                borderColor : ["#dddddd", mainColor],
                backgroundColor : ["#dddddd", mainColor]
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
        detail_labels: [
            start.format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月"),
            start.add(1, "M").format("YY年M月")
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
                borderColor : mainColor,
                backgroundColor : mainColor
            }
        ]
    };
    return barChartData;
}

function addCommaYen(item) {
    return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +' 円';
}

// とある4週間分のデータログ
var barChartData = {
    labels: ['5月','6月','7月','8月','9月','10月'],
    datasets: [
        {
            label: 'サンプル',
            data: ['240000','240000','240000','240000','240000','240000'
                  ],
            borderColor : "rgba(14,78,173,0.85)",
            backgroundColor : mainColor
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
            label: '子どもと過ごす時間',
            data: ['1000','2000'],
            borderColor: ['#dddddd', mainColor],
            backgroundColor: ['#dddddd', mainColor]
        }
    ]
};

var pieChartData = {
    datasets: [{
        data: [20, 10],
        backgroundColor: [mainColor, "#dddddd"]
    }],
    // これらのラベルは凡例とツールチップに表示されます。
    labels: [
        '育児休業給付金',
        '手取りから減る金額'
    ]
};
