// DOM定義
// input系
var inputBirthday = $('[data-id="inputBirthday"]');
var inputTwins = $('[data-id="inputTwins"]');
var inputMonthlyAllSalary = $('[data-id="inputMonthlyAllSalary"]');
var inputMonthlySalary = $('[data-id="inputMonthlySalary"]');
var inputIkukyuPlan =  $('[data-id="inputIkukyuPlan"]');
var inputWorkTime =  $('[data-id="inputWorkTime"]');

// 表示系
var birthDay = $('[data-id="birthDay"]');
var papaIkukyuStart = $('[data-id="papaIkukyuStart"]');
var papaIkukyuEnd = $('[data-id="papaIkukyuEnd"]');
var mamaBeforeSankyuStart = $('[data-id="mamaBeforeSankyuStart"]');
var mamaBeforeSankyuEnd = $('[data-id="mamaBeforeSankyuEnd"]');
var mamaAfterSankyuStart = $('[data-id="mamaAfterSankyuStart"]');
var mamaAfterSankyuEnd = $('[data-id="mamaAfterSankyuEnd"]');
var mamaIkukyuStart = $('[data-id="mamaIkukyuStart"]');
var mamaIkukyuEnd = $('[data-id="mamaIkukyuEnd"]');
var selectedIkukyuPlan = $('[data-id="selectedIkukyuPlan"]');
var allSalary = $('[data-id="allSalary"]');
var childTime = $('[data-id="childTime"]');
var childTimeMonth = $('[data-id="childTimeMonth"]');
var salaryTable = $('[data-id="salaryTable"]');
var kyufu = $('[data-id="kyufu"]');
var ikusimResults = $('[data-id="ikusimResults"]');
var exampleResultsH2 = $('[data-id="exampleResultsH2"]');
var resultsH2 = $('[data-id="resultsH2"]');
var canvasData = null;

// パーツ
var startSimButton = $('[data-id="startSim"]');

// CSS用変数
var mainColor = "rgba(14,78,173,0.85)";
var accentColor = "rgba(255,152,0,0.8)";
var gradient0 = "#000046",
    gradient1 = "#1CB5E0";


// イベント
startSimButton.on('click', function() {
    ikusimResults.css({
        "opacity": "1.0",
        "pointer-events": "initial"
    });
    resultsH2.css("display", "block");
    exampleResultsH2.css("display", "none");
    cal();
});

//**** onloadイベント ****//
// chart.js レンダリング
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

// 関数
function cal() {
    var birthDate = moment(inputBirthday.val());

    var monthlyAllSalary = inputMonthlyAllSalary.val();
    var monthlySalary = inputMonthlySalary.val();
    var workTime = inputWorkTime.val();
    var ikukyuPlan = inputIkukyuPlan.val();

    var papaIkukyuStartDate = moment(inputBirthday.val());
    var papaIkukyuEndDate = moment(inputBirthday.val()).add(ikukyuPlan, "M").add(-1, "d");

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
    selectedIkukyuPlan.text(inputIkukyuPlan.find("option:selected").text());
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

    graph(papaIkukyuStartDate, papaIkukyuEndDate, ikukyuPlan, monthlyAllSalary, monthlySalary, workTime);

    allSalary.text(salaryPercentage(monthlyAllSalary, monthlySalary, ikukyuPlan));
    childTime.text(withChildTime(workTime, ikukyuPlan));
    childTimeMonth.text(withChildTime(workTime, ikukyuPlan)/24);
}

// chart.js options
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

// chart.js グラフ描画
function graph(start, end, ikukyuPlan, monthlyAllSalary, monthlySalary, workTime) {
    window.myBar.data = salaryData(start, ikukyuPlan, monthlyAllSalary);
    window.myBar.update();
    window.myBar2.data = withChildTimeData(workTime, ikukyuPlan);
    window.myBar2.update();
    window.myPieChart.data = salaryPercentageData(monthlyAllSalary, monthlySalary, ikukyuPlan);
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

// データ作成 給付金
function salaryData(start, month, salary) {
    var salary67 = salary * 0.67;
    var salary50 = salary * 0.50;

    // 給付金データ
    var salaryArray = [];
    for(var i = 1; i <= month; i++) {
        if(salaryArray.length % 2 == 0) {
            salaryArray.push( i <= 6 ? salary67 * 2 : salary50 * 2);
        } else {
            salaryArray.push(0);
        }

        if(i == month) {
            salaryArray.pop();
            if(salaryArray.length % 2 == 0) {
                salaryArray.push( i <= 6 ? salary67 : salary50);
            }
        }
    }
    salaryArray.unshift(0, 0);

    // ラベル
    var labels = [];
    var detailLabels = [];
    for(var i = 0; i <=  salaryArray.length - 1; i++) {
        labels.push(start.clone().add(i, "M").format("M月"));
        detailLabels.push(start.clone().add(i, "M").format("YY年M月"));
    }

    var barChartData = {
        labels: labels,
        detail_labels: detailLabels,
        datasets: [
            {
                label: '育児休業給付金',
                data: salaryArray,
                borderColor : mainColor,
                backgroundColor : mainColor
            }
        ]
    };
    return barChartData;
}

// データ作成 給付金割合
function salaryPercentage(allSalary, salary, month) {
    var salary67 = allSalary * 0.67;
    var salary50 = allSalary * 0.50;
    salaryTable.find("tbody").append('<tr><th scope="row">合計</th><td class="td2">' + addCommaYen(sumKyufu(allSalary, month)) + '</td><td class="td3">'+ addCommaYen(salary * month) + '</td></tr>');


    return ((sumKyufu(allSalary, month) / (salary * month)) * 100).toFixed(1);
}

function salaryPercentageData(allSalary, salary, month) {
    var salary67 = allSalary * 0.67;
    var salary50 = allSalary * 0.50;
    var yearSalary = sumKyufu(allSalary, month);
    kyufu.text(addCommaYen(yearSalary));

    return {
        datasets: [{
            data: [yearSalary, salary * month - yearSalary],
            backgroundColor: [mainColor, "#dddddd"]
        }],

        // これらのラベルは凡例とツールチップに表示されます。
        labels: [
            '育児休業給付金',
            '減るお金'
        ]
    };
}

function sumKyufu(allSalary, month) {
    return (month <= 6 ? allSalary * 0.67 * month : allSalary * 0.67 * (month - 6)) + (month <= 6 ? 0 : allSalary * 0.50 * (month - 6));
}

// データ作成 子どもとの時間
function withChildTime(workTime, month){
    return workTime * 20 * month;
}

function withChildTimeData(workTime, month){
    return  {
        labels: ['休まない','休む'],
        datasets: [
            {
                label: '子どもと過ごす時間',
                data: [(24 - 8 - workTime) * 20 * month, (24 - 8) * 20 * month],
                borderColor : ["#dddddd", mainColor],
                backgroundColor : ["#dddddd", mainColor]
            }
        ]
    };
}

// カンマ、単位（円）付与
function addCommaYen(item) {
    return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +' 円';
}

// 画像作成
function createImage(element, btn) {
    html2canvas(document.querySelector(element)).then(canvas => {
        // document.body.appendChild(canvas);
        canvasData = canvas;
        document.getElementById(btn).href = canvasData.toDataURL();
    });
}

// サンプルデータ
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
