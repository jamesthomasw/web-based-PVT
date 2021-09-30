let database = firebase.database();

let usernameValue = "James";

// Fungsi untuk memanggil data baseline dari database dan menyimpan data dalam browser
database.ref('Baseline/' + usernameValue).once('value', function(snapshot) {
    let meanBaseline = snapshot.val().rata_rata;
    let fastestBaseline = snapshot.val().respon_cepat;
    let slowestBaseline = snapshot.val().respon_lambat;
    let lapseBaseline = snapshot.val().banyaknya_miss;

    localStorage.setItem("meanBaseline", meanBaseline);
    localStorage.setItem("fastestBaseline", fastestBaseline);
    localStorage.setItem("slowestBaseline", slowestBaseline);
    localStorage.setItem("lapseBaseline", lapseBaseline);
})

// Array utuk masing metric baseline beserta dengan batas bawah dan batas atas dari toleransi yang ditentukan
let meanBaselineArray = [];
let fastestBaselineArray = [];
let slowestBaselineArray = [];
let lapseBaselineArray = [];

let lowMeanBaselineArray = [];
let lowFastestBaselineArray = [];
let lowSlowestBaselineArray = [];
let lowLapseBaselineArray = [];

let highMeanBaselineArray = [];
let highFastestBaselineArray = [];
let highSlowestBaselineArray = [];
let highLapseBaselineArray = [];

// Menyimpan data dari browser ke dalam variabel
let meanBaselineValue = localStorage.getItem("meanBaseline");
let fastestBaselineValue = localStorage.getItem("fastestBaseline");
let slowestBaselineValue = localStorage.getItem("slowestBaseline");
let lapseBaselineValue = localStorage.getItem("lapseBaseline");

// Menyimpan nilai batas toleransi yang telah ditentukan
let lowThresholdValue = parseFloat(localStorage.getItem("lowThresholdValue"));
let highThresholdValue = parseFloat(localStorage.getItem("highThresholdValue"));

// Fungsi untuk mengubah nilai batas toleransi dari desimal menjadi persentase
function floatToPercentage(decimalValue) {
    let result = (decimalValue * 100) + "%";

    return result;
}

// Menyimpan label batas atas dan batas bawah untuk setiap grafik yang akan ditampilkan
let lowBaselineThresholdText = floatToPercentage(lowThresholdValue);
let highBaselineThresholdText = floatToPercentage(highThresholdValue);

// Menyimpan nilai batas atas dan batas bawah ke dalam variabel
let lowThreshold = 1 + lowThresholdValue;
let highThreshold = 1 + highThresholdValue;

// Menghitung batas atas dan batas bawah dari setiap metric data baseline dan menyimpan data ke dalam variabel
let lowMeanBaselineThreshold = lowThreshold * meanBaselineValue;
let highMeanBaselineThreshold = highThreshold * meanBaselineValue;

let lowFastestBaselineThreshold = lowThreshold * fastestBaselineValue;
let highFastestBaselineThreshold = highThreshold * fastestBaselineValue;

let lowSlowestBaselineThreshold = lowThreshold * slowestBaselineValue;
let highSlowestBaselineThreshold = highThreshold * slowestBaselineValue;

// Memanggil batas atas dan batas bawah banyaknya miss dari browser
let lowLapseBaselineThreshold = localStorage.getItem("lowLapseThresholdValue");
let highLapseBaselineThreshold = localStorage.getItem("highLapseThresholdValue");

// Mengatur database untuk menyortir data untuk menampilkan hanya data id pekerja itu saja
let trialRef = database.ref().child('Trial').orderByChild('nama_responden').equalTo(usernameValue).limitToLast(12);

// Array untuk menyimpan data setiap pengukuran Trial yagn telah dilakukan sampai tanggal terkini
let myMeanArray = [];
let myFastestArray = [];
let mySlowestArray = [];
let myLapseArray = [];
let myDateArray = [];

trialRef.once('value', function(snapshot) {
    snapshot.forEach(function(item) {
        let meanValue = item.val().rata_rata;
        myMeanArray.push(meanValue);

        let fastestValue = item.val().respon_cepat;
        myFastestArray.push(fastestValue);

        let slowestValue = item.val().respon_lambat;
        mySlowestArray.push(slowestValue);

        let lapseValue = item.val().banyaknya_miss;
        myLapseArray.push(lapseValue);

        let tanggalValue = item.val().tanggal_pengukuran;
        myDateArray.push(tanggalValue);
        
    })

    console.log(myDateArray);

    // Mengatur data baseline beserta dengan batas atas dan batas bawah untuk mengikuti jumlah data trial yang ada 
    for (let i = 0; i < myDateArray.length; i++) {
        meanBaselineArray.push(meanBaselineValue);
        highMeanBaselineArray.push(highMeanBaselineThreshold);
        lowMeanBaselineArray.push(lowMeanBaselineThreshold);

        fastestBaselineArray.push(fastestBaselineValue);
        highFastestBaselineArray.push(highFastestBaselineThreshold);
        lowFastestBaselineArray.push(lowFastestBaselineThreshold);

        slowestBaselineArray.push(slowestBaselineValue);
        highSlowestBaselineArray.push(highSlowestBaselineThreshold);
        lowSlowestBaselineArray.push(lowSlowestBaselineThreshold);

        lapseBaselineArray.push(lapseBaselineValue);
        highLapseBaselineArray.push(highLapseBaselineThreshold);
        lowLapseBaselineArray.push(lowLapseBaselineThreshold);

        console.log(meanBaselineArray)
    }

    // Melakukan plot grafik rata-rata, respon paling cepat, respon paling lambat dan banyaknya miss
    var trialMean = {
        x: myDateArray,
        y: myMeanArray,
        mode: 'lines+markers',
        name: 'Trial',
    }

    var lowBaselineMean = {
        x: myDateArray,
        y: lowMeanBaselineArray,
        mode: 'lines',
        name: lowBaselineThresholdText + ' Baseline',
        line: {
            dash: 'dashdot',
            width: 3,
        }
    }

    var highBaselineMean = {
        x: myDateArray,
        y: highMeanBaselineArray,
        mode: 'lines',
        name: highBaselineThresholdText + ' Baseline',
        line: {
            dash: 'dashdot',
            width: 3,
        }
    }

    var baselineMean = {
        x: myDateArray,
        y: meanBaselineArray,
        mode: 'lines+markers',
        name: 'Baseline',
    }

    var dataMean = [trialMean, baselineMean, lowBaselineMean, highBaselineMean];

    var layoutMean = {
        title: 'Perbandingan Rata-rata Respon'
    }

    Plotly.newPlot('meanChart', dataMean, layoutMean);

    var trialFastest = {
        x: myDateArray,
        y: myFastestArray,
        mode: 'lines+markers',
        name: 'Trial',
    }

    var lowBaselineFastest = {
        x: myDateArray,
        y: lowFastestBaselineArray,
        mode: 'lines',
        name: lowBaselineThresholdText + ' Baseline',
        line: {
            dash: 'dashdot',
            width: 3,
        }
    }

    var highBaselineFastest = {
        x: myDateArray,
        y: highFastestBaselineArray,
        mode: 'lines',
        name: highBaselineThresholdText + ' Baseline',
        line: {
            dash: 'dashdot',
            width: 3,
        }
    }

    var baselineFastest = {
        x: myDateArray,
        y: fastestBaselineArray,
        mode: 'lines+markers',
        name: 'Baseline',
    }

    var dataFastest = [trialFastest, baselineFastest, lowBaselineFastest, highBaselineFastest];

    var layoutFastest = {
        title : 'Perbandingan Respon Paling Cepat',
    }

    Plotly.newPlot('fastestChart', dataFastest, layoutFastest);

    var trialSlowest = {
        x: myDateArray,
        y: mySlowestArray,
        mode:'lines+markers',
        name: 'Trial',
    }

    var lowBaselineSlowest = {
        x: myDateArray,
        y: lowSlowestBaselineArray,
        mode: 'lines',
        name: lowBaselineThresholdText + ' Baseline',
        line: {
            dash: 'dashdot',
            width: 3,
        }
    }

    var highBaselineSlowest = {
        x: myDateArray,
        y: highSlowestBaselineArray,
        mode: 'lines',
        name: highBaselineThresholdText  + ' Baseline',
        line: {
            dash: 'dashdot',
            width: 3,
        }
    }

    var baselineSlowest = {
        x: myDateArray,
        y: slowestBaselineArray,
        mode: 'lines+markers',
        name: 'Baseline',
    }

    var dataSlowest = [trialSlowest, baselineSlowest, lowBaselineSlowest, highBaselineSlowest]

    var layoutSlowest = {
        title: 'Perbandingan Respon Paling Lambat',
    }

    Plotly.newPlot('slowestChart', dataSlowest, layoutSlowest)

    var trialLapse = {
        x: myDateArray,
        y: myLapseArray,
        mode: 'lines+markers',
        name: 'Trial',
    }

    var lowBaselineLapse = {
        x: myDateArray,
        y: lowLapseBaselineArray,
        mode: 'lines',
        name: '#(l)Baseline ',
        line: {
            dash: 'dashdot',
            width: 3,
        }
    }

    var highBaselineLapse = {
        x: myDateArray,
        y: highLapseBaselineArray,
        mode: 'lines',
        name: '#(h)Baseline ',
        line: {
            dash: 'dashdot',
            width: 3,
        }
    }

    var baselineLapse = {
        x: myDateArray,
        y: lapseBaselineArray,
        mode: 'lines+markers',
        name: 'Baseline',
    }

    var dataLapse = [trialLapse, baselineLapse, lowBaselineLapse, highBaselineLapse];

    var layoutLapse = {
        title: 'Perbandingan Banyaknya Miss',
    }

    Plotly.newPlot('lapseChart', dataLapse, layoutLapse)
})










