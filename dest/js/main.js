// main処理
window.onload = function() {
    Ikusim.mychart.bar1 = new Ikusim.Chart("canvas");
    Ikusim.mychart.pie1 = new Ikusim.Chart("canvas-2");
    Ikusim.mychart.bar2 = new Ikusim.Chart("canvas-3");
    Ikusim.event.onload();
    Ikusim.util.smoothScroll();
};

// CSS用変数
var mainColor = "rgba(14,78,173,0.85)";
var accentColor = "rgba(255,152,0,0.8)";
var gradient0 = "#000046",
    gradient1 = "#1CB5E0";


// 名前空間(空のコンストラクタを生成)
var Ikusim = function() {};

Ikusim = {
    // event:
    event: {
        onload: {},
        bind: {},
        start: {},
        output: {}
    },
    // util: 共通モジュール
    util: {
        smoothScroll: {},
        yen: {},
        capture: {}
    },
    // chart: チャートモジュール（chart.js使用）
    chart: {
        bar: {},
        pie: {},
        barOption: {},
        pieOption: {}
    },
    mychart: {},
    table : {},
    inherits: {}
};


// Chart: グラフ描画用クラス
Ikusim.Chart = function(ctx) {
    this.ctx = document.getElementById(ctx).getContext("2d");
};

Ikusim.Chart.prototype.create = function(type, data, options) {
    return this.graph = new Chart(this.ctx, {
        type: type, // ここは bar にする必要があります
        data: data,
        options: options
    });
};

Ikusim.Chart.prototype.update = function(data, options) {
    this.graph.data =  data;
    this.graph.options = options;
    this.graph.update();
};

// event: 制御
Ikusim.event.onload = (function() {
    var sample = new Ikusim.Sample("2018-07-22", "290000", "240000", 12, 9);

    Ikusim.mychart.bar1.create("bar", sample.getBenefitData(), Ikusim.chart.BarYenOptions());
    Ikusim.mychart.pie1.create("pie", sample.getBenefitDifData(), Ikusim.chart.PieOptions());
    Ikusim.mychart.bar2.create("bar", sample.getSpendTimeDifData(), Ikusim.chart.BarTimeOptions());

    Ikusim.event.output(sample);
    Ikusim.event.bind();
});

Ikusim.event.bind = (function() {
    var $startSimButton = $('[data-id="startSim"]');
    var $results = $('[data-id="ikusimResults"]');
    var $exampleResultsH2 = $('[data-id="exampleResultsH2"]');
    var $resultsH2 = $('[data-id="resultsH2"]');
    var $canvasData = null;
    var $plan = $('[data-id="inputIkukyuPlan"]');
    var $papaMama = $("[name=inputPapaMama]:checked");

    $plan.change(
    );


    $startSimButton.on('click', function() {
        $results.css({
            "opacity": "1.0",
            "pointer-events": "initial"
        });

        $resultsH2.css("display", "block");
        $exampleResultsH2.css("display", "none");

        Ikusim.event.start();
    });
});

Ikusim.event.chartUpdate = (function(obj) {
    Ikusim.mychart.bar1.update(obj.getBenefitData(), Ikusim.chart.BarYenOptions());
		Ikusim.mychart.pie1.update(obj.getBenefitDifData(), Ikusim.chart.PieOptions());
		Ikusim.mychart.bar2.update(obj.getSpendTimeDifData(), Ikusim.chart.BarTimeOptions());
});

Ikusim.event.output = (function(obj) {
		Ikusim.table(obj);
    obj.changeSumBenefit();
    obj.changePerBenefit();
    obj.changeSumSpendTime();
    obj.changePlan();

    setTimeout(function(){
        Ikusim.util.capture("#capture", "ikusim-money");
        Ikusim.util.capture("#capture2", "ikusim-childtime");
	  }, 500);
});

//
Ikusim.event.start = (function() {
    var $papaMama = $("[name=inputPapaMama]:checked").val();
    var target =  $papaMama === "papa" ? new Ikusim.Papa() : new Ikusim.Mama();

    Ikusim.event.chartUpdate(target);
    Ikusim.event.output(target);
});


 // util: 共通モジュール
Ikusim.util.smoothScroll = (function() {
    $('button[href^="#"]').click(function() {
        var speed = 600;
        var href= $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        $('body,html').animate({scrollTop:position}, speed, 'swing');
        return false;
    });
});

Ikusim.util.yen = (function(item) {
    return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +' 円';
});

Ikusim.util.capture = (function(element, btn) {
    html2canvas(document.querySelector(element)).then(canvas => {
        canvasData = canvas;
        document.getElementById(btn).href = canvasData.toDataURL();
    });
});

// chart: チャートモジュール（chart.js使用）
Ikusim.chart.BarYenOptions = function(min, max) {
    return {
        chartArea: {},
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    // 最小値、最高値
                    min: min,
                    max: max,
                    // 目盛をコンマ＆円表記
                    callback: function(value, index, values) {
                        return Ikusim.util.yen(value);
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
                    return Ikusim.util.yen(tooltipItem.yLabel);
                }
            }
        }
    };
};

Ikusim.chart.BarTimeOptions = function(min, max) {
    return  {
        chartArea: {},
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
    };
};

Ikusim.chart.PieOptions = function() {
    return {
        cutoutPercentage: 50,
        maintainAspectRatio: false,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data){
                    return Ikusim.util.yen(data.datasets[0].data[tooltipItem.index]);
                }
            }
        }
    };
};

// table: テーブル更新
Ikusim.table = (function(obj) {
    var $table = $('[data-id="salaryTable"]').find("tbody");
    var data = obj.getBenefitData();
    $table.html("");

    $.each(data.detail_labels, function(index, item) {
        $table.append('<tr><th scope="row">'+ this + '</th><td class="td2">' + Ikusim.util.yen(data.datasets[0].data[index]) + '</td><td class="td3">'+ Ikusim.util.yen(obj.hometake) + '</td></tr>');
    });

    $table.append('<tr><th scope="row">合計</th><td class="td2">' + Ikusim.util.yen(obj.getSumBenefit()) + '</td><td class="td3">'+ Ikusim.util.yen(obj.getSumHometake()) + '</td></tr>');

});

// MyChart: グラフ描画用クラス
// クラス
Ikusim.MyChart = function() {
    this.ctx = document.getElementById("canvas").getContext("2d");
    this.ctx2 = document.getElementById("canvas-2").getContext("2d");
    this.ctx3 = document.getElementById("canvas-3").getContext("2d");
}

Ikusim.MyChart.prototype.createChart = function(data, options) {
    return new Chart(this.ctx, {
        type: 'bar', // ここは bar にする必要があります
        data: data,
        options: options
    });
};

// Papa: パパ用クラス
// クラス&コンストラクタ
Ikusim.Papa = function() {
    var $birthday = $('[data-id="inputBirthday"]');
    var $twins = $('[data-id="inputTwins"]');
    var $gross = $('[data-id="inputMonthlyAllSalary"]');
    var $hometake = $('[data-id="inputMonthlySalary"]');
    var $plan =  $('[data-id="inputIkukyuPlan"]');
    var $worktime =  $('[data-id="inputWorkTime"]');
    var $papamama = $("[name=inputPapaMama]:checked");

    // style用メンバ変数
    this.mainColor = "rgba(14,78,173,0.85)";
    this.accentColor = "rgba(255,152,0,0.8)";
    this.gradient0 = "#000046";
    this.gradient1 = "#1CB5E0";

    //メンバ変数、thisはインスタンス
    this.start = $birthday.val();
    this.gross = $gross.val();
    this.hometake = $hometake.val();
    this.plan = $plan.val();
    this.worktime = $worktime.val();
    this.papamama = $papamama.val();

    // 最低額、最高額をチェック
    if(this.gross >= 447300) {
        this.gross = 447300;
    } else if(this.gross <= 74100) {
        this.gross = 74100;
    }
};

// 定数
Ikusim.Papa.X67 = 0.67;
Ikusim.Papa.X50 = 0.50;

// メソッド、getXXXはデータ算出用
Ikusim.Papa.prototype.getStartDate = function() {
    return moment(this.start);
};

Ikusim.Papa.prototype.getEndDate = function() {
    return moment(this.start).add(this.plan, "M").add(-1, "d");
};

Ikusim.Papa.prototype.getPlan = function() {
    var $inputIkukyuPlan =  $('[data-id="inputIkukyuPlan"]');
    return $inputIkukyuPlan.find("option:selected").text();
};

Ikusim.Papa.prototype.getGross67 = function() {
    return this.gross * Ikusim.Papa.X67;
};

Ikusim.Papa.prototype.getGross50 = function() {
    return this.gross * Ikusim.Papa.X50;
};

Ikusim.Papa.prototype.getSumBenefit = function() {
    var gross67 = this.getGross67();
    var gross50 = this.getGross50();
    var month = this.plan;
    var sum = 0;
    var calcMonth = month;

    if (this.papamama === "mama") {
        calcMonth = month - 2;
    }

    sum = (month <= 6 ? gross67 * calcMonth : gross67 * 6) + (month <= 6 ? 0 : gross50 * (calcMonth - 6));

    return sum;
};

Ikusim.Papa.prototype.getSumSankyuBenefit = function() {
    return (this.gross / 30 / 3 * 2 * 98).toFixed(0);
};

Ikusim.Papa.prototype.getSumHometake = function() {
    // return this.hometake * this.plan;
    return this.papamama === "papa" ? this.hometake * this.plan : this.hometake * (this.plan - 2);
};

Ikusim.Papa.prototype.getSumSpendTime = function() {
    // return this.worktime * 20 * this.plan;
    return this.papamama === "papa" ? this.worktime * 20 * this.plan : this.worktime * 20 * (this.plan - 2);
};

Ikusim.Papa.prototype.getPerBenefit = function() {
    return ((this.getSumBenefit() / this.getSumHometake()) * 100).toFixed(1);
};

// メソッド、changeXXXは表示更新用
Ikusim.Papa.prototype.changePlan = function() {
    var $papaIkukyuStart = $('[data-id="papaIkukyuStart"]');
    var $papaIkukyuEnd = $('[data-id="papaIkukyuEnd"]');
    var $selectedIkukyuPlan = $('[data-id="selectedIkukyuPlan"]');

    $papaIkukyuStart.text(this.getStartDate().format("YYYY年M月D日"));
    $papaIkukyuEnd.text(this.getEndDate().format("YYYY年MM月D日"));
    $selectedIkukyuPlan.text(this.getPlan());
};

Ikusim.Papa.prototype.changeSumBenefit = function() {
    var $sumBenefit = $('[data-id="kyufu"]');
    $sumBenefit.html(Ikusim.util.yen(this.getSumBenefit()));
};

Ikusim.Papa.prototype.changePerBenefit = function() {
    var $benefitDif = $('[data-id="allSalary"]');
    $benefitDif.html(this.getPerBenefit());
};

Ikusim.Papa.prototype.changeSumSpendTime = function() {
    var $childTime = $('[data-id="childTime"]');
    var $childTimeDay = $('[data-id="childTimeMonth"]');
    var $workTime = $('[data-id="workTime"]');

    $childTime.html(this.getSumSpendTime());
    $childTimeDay.html(this.getSumSpendTime() / 24);
    $workTime.html(this.worktime);
};

Ikusim.Papa.prototype.getBenefitData = function() {
    // 給付金データ
    var salaryArray = [];
    var start = this.getStartDate();
    var gross67 = this.getGross67();
    var gross50 = this.getGross50();
    var maxMonth = 12;

    for(var i = 1; i <= maxMonth; i++) {
        if(salaryArray.length % 2 == 0) {
            salaryArray.push( i <= 6 ? gross67 * 2 : gross50 * 2);
        } else {
            salaryArray.push(0);
        }
    }

    salaryArray.unshift(0, 0);

    if(this.papamama === "mama") {
        salaryArray.unshift(0, 0, 0);
        salaryArray[4] = this.getSumSankyuBenefit();
    }

    salaryArray = this.calcBenefitData(salaryArray);


    // ラベル
    var labels = [];
    var detailLabels = [];

    for(var i = 0; i <=  salaryArray.length - 1; i++) {
        labels.push(start.clone().add(i, "M").format("M月"));
        detailLabels.push(start.clone().add(i, "M").format("YY年M月"));
    }

    // ママ用ラベル追加
    if(this.papamama === "mama") {
        var color = [];
        var sankyuBenefitArray = [];

        for(var i = 0; i < salaryArray.length; i++) {
            color.push(this.mainColor);
            sankyuBenefitArray.push(0);
        }

        color[4] = "#eeeeee";

        labels.unshift(start.clone().add(-1, "M").format("M月"));
        detailLabels.unshift(start.clone().add(-1, "M").format("YY年M月"));
        labels.pop();
        detailLabels.pop();
    } else {
        var color = this.mainColor;
    }

    var benefitData = {
        labels: labels,
        detail_labels: detailLabels,
        datasets: [
            {
                label: '育児休業給付金',
                data: salaryArray,
                borderColor : color,
                backgroundColor : color
            }
        ]
    };

    return benefitData;
};

// メソッド、xxxDataはchart用のデータ・セット
Ikusim.Papa.prototype.calcBenefitData = function(data) {
    var oneMonth = this.papamama === "papa" ? 3 : 6;
    var otherMonth = this.papamama === "papa" ? Number(this.plan) + 1 : Number(this.plan) + 4;

    if (this.plan === "1") {
        data = data.slice(0, oneMonth);
        data[data.length - 1] = this.getGross67();
    } else if(this.plan % 2 === 1) {
        data = data.slice(0, otherMonth);
        this.plan > 6 ? data[data.length - 1] = this.getGross50() : data[data.length - 1] = this.getGross67();
    } else {
        data = data.slice(0, otherMonth);
    }

    return data;
};

Ikusim.Papa.prototype.getBenefitDifData = function() {
    var salary67 = this.getGross67();
    var salary50 = this.getGross50();
    var yearSalary = this.getSumBenefit();
    var yearHometake = this.getSumHometake();

    // kyufu.text(addCommaYen(yearSalary));

    return {
        datasets: [{
            data: [yearSalary, yearHometake - yearSalary],
            backgroundColor: [this.mainColor, "#dddddd"]
        }],

        // これらのラベルは凡例とツールチップに表示されます。
        labels: [
            '育児休業給付金',
            '減るお金'
        ]
    };
};

Ikusim.Papa.prototype.getSpendTimeDifData = function() {
    return  {
        datasets: [
            {
                label: '子どもと過ごす時間',
                data: [(24 - 8 - this.worktime) * 20 * this.plan, (24 - 8) * 20 * this.plan],
                borderColor : ["#dddddd", this.mainColor],
                backgroundColor : ["#dddddd", this.mainColor]
            }
        ],
        labels: ['休まない','休む']
    };
};

// 継承用関数
Ikusim.inherits = function(childCtor, parentCtor) {
  // 子クラスの prototype のプロトタイプとして 親クラスの
  // prototype を指定することで継承が実現される
  Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};


// Sample: サンプル用クラス
Ikusim.Sample = function(start, gross, hometake, plan, worktime) {
    // 親のコンストラクタを呼び出す。呼び出しの際に "this" が
    // 適切に設定されるようにする (Function#call を使用)
    Ikusim.Papa.call(this);

    // Sample 固有のプロパティを初期化する
    this.start = start;
    this.gross = gross;
    this.hometake = hometake;
    this.plan = plan;
    this.worktime = worktime;
};

Ikusim.inherits(Ikusim.Sample, Ikusim.Papa);

// Mama: ママ用クラス
// クラス&コンストラクタ
Ikusim.Mama = function() {
    // style用メンバ変数
    this.mainColor = "rgba(14,78,173,0.85)";
    this.accentColor = "rgba(255,152,0,0.8)";
    this.gradient0 = "#000046";
    this.gradient1 = "#1CB5E0";

    Ikusim.Papa.call(this);
};

// メソッド、getXXXはデータ算出用
Ikusim.Mama.prototype.getBeforeBirthStartDate = function() {
    if ($twins.prop('checked')) {
        return moment(this.start).add(-97, "d");
    } else {
        return moment(this.start).add(-41, "d");
    }
};

Ikusim.Mama.prototype.getBeforeBirthEndDate = function() {
    return moment(this.start);
};

Ikusim.Mama.prototype.getAfterBirthStartDate = function() {
    return moment(this.start).add(1, "d");
};

Ikusim.Mama.prototype.getAfterBirthEndDate = function() {
    return moment(this.start).add(56, "d");
};

Ikusim.Mama.prototype.getIkukyuStartDate = function() {
    return moment(this.start).add(57, "d");
};

Ikusim.Mama.prototype.getIkukyuEndDate = function() {
    return moment(this.start).add(1, "y").add(-1, "d");
};

Ikusim.Mama.prototype.changePlan = function() {
    var $mamaBeforeBirthStart = $('[data-id="mamaBirthStart"]');
    var $mamaBeforeBirthEnd = $('[data-id="mamaBeforeBirthEnd"]');
    var $mamaAfterBirthStart = $('[data-id="mamaAfterBirthStart"]');
    var $mamaAfterBirthEnd = $('[data-id="mamaAfterBirthEnd"]');
    var $mamaIkukyuStart = $('[data-id="mamaIkukyuStart"]');
    var $mamaIkukyuEnd = $('[data-id="mamaIkukyuEnd"]');

    var $selectedIkukyuPlan = $('[data-id="selectedIkukyuPlan"]');

    $mamaIkukyuStart.text(this.getIkukyuStartDate().format("YYYY年M月D日"));
    $mamaIkukyuEnd.text(this.getIkukyuEndDate().format("YYYY年MM月D日"));

    $selectedIkukyuPlan.text(this.getPlan());
};

Ikusim.inherits(Ikusim.Mama, Ikusim.Papa);
