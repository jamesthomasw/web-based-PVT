let database = firebase.database();

// Mengambil data-data awal pengukuran PVT Trial yang sudah disimpan sebelumnya
let usernameValue = localStorage.getItem("username");
let pengujianValue = localStorage.getItem("pengujianValue")
let shiftValue = localStorage.getItem("shiftValue");

// Mendefinisikan nilai awal variabel
let tingkatKantuk = 1;

// Mengubah nilai variabel ketika ada pergantian nilai yang dilakukan oleh user
let kss = document.getElementById("kssValue");
kss.addEventListener("change", function() {
    tingkatKantuk = this.value;
})

// Mendefinisikan variabel untuk fungsi setInterval()
let testInterval = 0;
let trialInterval = 0;

let testTime = null;

// Mendefinisikan nilai awal status pengukuran
let testStatus = "stopped";

// Mendefinisikan nilai awal status display dan status timer
let displayStatus = "hidden";
let timerStatus = "stopped";

// Mendefinisikan DOM tempat untuk user melakukan input pada program PVT
let screen = document.getElementById("screen");

let hidInterval, randInterval = 0;

// Mendefinisikan nilai awal variabel lama waktu pengukuran
let testLength = 20000;

// Mengubah nilai lama waktu pengukuran ketika ada pergantian nilai oleh user
let waktu = document.getElementById("lamaWaktu");
waktu.addEventListener("change", function() {
    testLength = this.value;
})

// Mendefinisikan nilai awal variabel untuk stop program ketika nilai berubah menjadi true
let stopCounting = false;

// Mendefinisikan DOM tombol 'SIAP' pada halaman siap PVT Trial
let testButton = document.getElementById("testButton");

// Adding Event Listener to the button to wait for trigger input from the user
testButton.addEventListener("click", testStart);

// Fungsi untuk melakukan cek status display terlebih dahulu ketika user memberikan trigger input
function displayCheck() {
    if (displayStatus == "hidden") {
        document.getElementById("timer").style.display = "block"
        // Apabila status display masih belum muncul maka akan error
        document.getElementById("timer").innerHTML = "ERR";
        setTimeout(function() {
            document.getElementById("timer").style.display = "none";
        },500)
        clearInterval(randInterval);
        // Fungsi pvtTrial akan dipanggil kembali untuk mengulang algoritma memunculkan display
        pvtTrial();
    } else {
        // Apabila status display sudah muncul maka timer akan berhenti
        timerStop();
    }
}

// Mendefinisikan nilai awal variabel untuk tanggal dan waktu pengukuran
let dateTime = undefined;
let date = undefined;
let time = undefined;
let today = new Date();

// Fungsi untuk memanggil tanggal dan waktu pengukuran
function getDateTime() {
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    time = hours(today) + ":" + minutes(today) + ":" + seconds(today);
    dateTime = date + ' ' + time;
}

// Fungsi untuk memformat waktu pengukuran agar selalu dua digit (xx:xx:xx)
function hours(today) {
    return(today.getHours() < 10 ? '0' : '') + today.getHours();
}

function minutes(today) 
{ 
  return (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
}

function seconds(today) 
{ 
  return (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
}

// Mendefinisikan nilai awal variabel id unik dari node JSON Tree untuk menyimpan data pengujian PVT Trial
let newKey = undefined;

// fungsi untuk memulai pengujian PVT
function testStart() {
    getDateTime();

    // Menyimpan id unik dan acak yang disediakan oleh Firebase
    newKey = database.ref('Trial/').push().key;
    console.log(newKey);

    // Data-data yang telah dipanggil dri halaman sebelumnya beserta dengan data-data yang diperoleh dari halaman ini akan disimpan ke dalam database dengan id unik masing" yang telah disimpan sebelumnya
    database.ref('Trial/').child(newKey).set({
        nama_responden: usernameValue,
        tanggal_pengujian: dateTime,
        jenis_pengujian: pengujianValue,
        shift_kerja: shiftValue,
        tingkat_kantuk: tingkatKantuk,
        lama_waktu_pengujian: testLength
    });

    // Pengujian PVT dimulai
    document.getElementById("testButton").style.display = "none";
    document.getElementById("license").style.display = "none"
    document.getElementById("siapTrial").style.display = "none";
    document.getElementById("screen").style.display = "block";
    
    // Fungsi untuk menjalankan timer test yang mengindikasikan waktu pengujian secara keseluruhan
    let startTime = Date.now();

    testInterval = setInterval(function() {
        let testTime = Date.now() - startTime;
        document.getElementById("test").innerHTML = testTime;
    }, 1);
    testStatus = "started"
    console.log(testStatus);

    // Fungsi program PVT
    pvtTrial();

    // Fungsi untuk stop pengujian
    testStop();
}

// Fungsi program PVT
function pvtTrial() {
    // Fungsi untuk menjalankan timer trial yang mengindikasi waktu respon ketika display muncul dan user memberikan trigger input
    timerStart();
    screen.addEventListener("click", displayCheck);
}

// Fungsi untuk menjalankan timer Trial
function timerStart() {
    // Mendefinisikan nilai random untuk memunculkan display secara random
    let rand = Math.floor(Math.random() * (10 - 2 + 1)) + 2;

    // Fungsi untuk memunculkan display dan memulai timer trial ketika waktu random telah tercapai
    randInterval = setTimeout(function () {
        document.getElementById("display").style.display = "block";
        displayStatus = "displayed";

        // Fungsi untuk memulai timer trial
        let trialStartTime = Date.now();

        trialInterval = setInterval(function () {
            let elapsedTime = Date.now() - trialStartTime;
            document.getElementById("timer").innerHTML = elapsedTime
        }, 1);
        timerStatus = "started";
        console.log(timerStatus);

    }, rand * 1000);
    console.log(rand);
}

// Mendefinisikan array untuk menyimpan data pengukuran PVT Trial
let myData = [];

// Fungsi untuk stop timer trial ketika user memberikan trigger input
function timerStop() {
    // Menyembunyikan display
    document.getElementById("display").style.display = "none";
    displayStatus = "hidden";
    clearInterval(trialInterval);
    timerStatus = "stopped";
    // Memunculkan nilai timer trial
    document.getElementById("timer").style.display = "block";

    // Mendefinisikan nilai timer trial dan menyimpan nilai dalam variabel
    let rtValue = document.getElementById("timer").innerHTML;
    console.log(rtValue);
    // Mengecek apakah nilai timer trial < 100 atau tidak
    if (rtValue < 100) {
        document.getElementById("timer").innerHTML = "FS";
    }
    console.log(timerStatus);

    // Menyimpan nilai timer ke dalam array yang sudah ada
    myData.push(rtValue);
    console.log(myData);

    // Fungsi untuk menyembunyikan nilai timer dari layar
    hidInterval = setTimeout(function() {
        document.getElementById("timer").style.display = "none"
        displayStatus = "hidden";
        if (testTime < testLength) {
            pvtTrial();
        }
    }, 500);
}

// fungsi untuk stop pengujian
function testStop() {
    // Ketika lama waktu pengukuran telah tercapai maka pengujian akan berhenti
    setTimeout(function() {
        stopCounting = true;
        console.log(stopCounting);
        if (stopCounting == true) {
            clearInterval(testInterval);
            clearInterval(trialInterval);
            clearTimeout(hidInterval);
            clearTimeout(randInterval);
            testStatus = "stopped";
            console.log(testStatus);
            
            console.log(myData);

            // Mengolah data yang ada menjadi hasil pengukuran PVT Trial yang diinginkan
            getOutcomeMetric();

            // Menyimpan data awal beserta dengan olahan data menjadi hasil pengukuran PVT Trial ke dalam database dengan melakukan update pada id unik dan acak yang sama dengan yang sebelumnya
            database.ref('Trial/').child(newKey).update({
                respon_data: myData,
                rata_rata: myMean,
                respon_cepat: myFastest,
                respon_lambat: mySlowest,
                banyaknya_miss: myNumOfLapse
            });

            // Menyembunyikan halaman program PVT dan menampilkan halaman Terima kasih
            screen.style.display = "none";
            document.getElementById("thankYouMessage").style.display = "block";
            document.getElementById("license").style.display = "block";
            setTimeout(function() {
                document.getElementById("viewResult").style.display = "block";
            }, 1000);
        }
    }, testLength);
}

let instructionButton = document.getElementById("instructionButton");

// Ketika user menekan tombol pada halaman awal PVT Trial maka akan berpindah ke halaman instruksi
instructionButton.addEventListener("click", function() {
    document.getElementById("pvtScreen").style.display = "none";
    document.getElementById("instructionButton").style.display = "none";
    document.getElementById("instructionTrial").style.display = "block";
    document.getElementById("siapButton").style.display = "block";
})

let siapButton = document.getElementById("siapButton");

// Ketika user menekan tombol pada halaman instruksi PVT Trial maka akan berpindah ke halaman siap PVT Trial
siapButton.addEventListener("click", function() {
    document.getElementById("instructionTrial").style.display = "none";
    document.getElementById("siapButton").style.display = "none";
    document.getElementById("siapTrial").style.display = "block";
    document.getElementById("testButton").style.display = "block";
})

// Mendefinisikan nilai awal variabel dari hasil pengukuran PVT Trial
let myMean = 0;
let myFastest = 0;
let mySlowest = 0;
let myNumOfLapse = 0;

// Fungsi untuk mengolah data pengukuran PVT Trial
function getOutcomeMetric() {
    
    // Jumlah total nilai pengukuran
    let sum = 0
    for (let i = 0; i < myData.length; i++) {
        sum += parseInt(myData[i]);
    }
    console.log(sum);

    // Rata-rata
    var avg = sum / myData.length;
    console.log(avg);
    myMean = avg.toFixed(2);

    // Fungsi untuk menyortir data dari nilai paling kecil hingga nilai paling besar
    let newArray = [...myData];

    newArray.sort(function(a, b) {
        return a - b;
    })
    console.log(newArray)

    // Jumlah data yang harus diambil ketika menghitung respon paling cepat dan lambat
    let numOfFastSlowData = Math.floor(0.1 * newArray.length);
    console.log(numOfFastSlowData);

    // Respon paling cepat
    let fastest = [];
    for (let i = 0; i < numOfFastSlowData; i++) {
        fastest.push(newArray[i]);
    }
    console.log(fastest);
    let sumFastest = 0;
    for (let i = 0; i < fastest.length; i++) {
        sumFastest += parseInt(fastest[i]);
    }
    let avgFastest = sumFastest/fastest.length;
    console.log(avgFastest);
    myFastest = avgFastest.toFixed(1);

    // Respon paling lambat
    let slowest = [];
    for (let i = newArray.length - 1; i > ((newArray.length - 1) - numOfFastSlowData); i--) {
        slowest.push(newArray[i]);
    }
    console.log(slowest)
    let sumSlowest = 0;
    for (let i = 0; i < slowest.length; i++) {
        sumSlowest += parseInt(slowest[i]);
    }
    var avgSlowest = sumSlowest/slowest.length;
    console.log(avgSlowest);
    mySlowest = avgSlowest.toFixed(1);

    // Banyaknya miss
    let lapse = [];
    for (let i = 0; i < newArray.length; i++) {
        // Ketika nilai timer trial/ respon > 500 maka dihitung sebagai miss
        if (newArray[i] > 500) {
            lapse.push(newArray[i]);
        }
    }
    // Banyaknya miss dihitung dari jumlah data nilai respon yang dianggap sebagai miss
    myNumOfLapse = lapse.length;
}

let result = document.getElementById("viewResult");

// Fungsi untuk melihat hasil pengukuran PVT Trial
result.addEventListener("click", function() {
    // Fungsi untuk menganalisa hasil pengukuran PVT Trial kemudian menampilkan hasil analisa 
    metricAnalysis();

    // Menampilkan hasil pengukuran PVT Trial
    document.getElementById("thankYouMessage").style.display = "none";
    document.getElementById("resultTrial").style.display = "block";

    document.getElementById("dateTime").innerHTML = dateTime;
    document.getElementById("usernameResult").innerHTML = usernameValue;
    document.getElementById("tipePengujianResult").innerHTML = pengujianValue;
    document.getElementById("tipeShiftResult").innerHTML = shiftValue;

    document.getElementById("meanValue").innerHTML = myMean;
    document.getElementById("fastestValue").innerHTML = myFastest;
    document.getElementById("slowestValue").innerHTML = mySlowest;
    document.getElementById("numOfLapse").innerHTML = myNumOfLapse;
})

// Mendefinisikan nilai awal batas toleransi analisa hasil pengukuran PVT
let lowThreshold = 1 + parseFloat(localStorage.getItem("lowThresholdValue"));
let highThreshold = 1 + parseFloat(localStorage.getItem("highThresholdValue"));
let lowLapseThreshold = localStorage.getItem("lowLapseThresholdValue");
let highLapseThreshold = localStorage.getItem("highLapseThresholdValue");

// Mendefinisikan nilai awal variabel untuk menganalisa hasil pengukuran PVT
let meanBaseline = undefined;
let fastestBaseline = undefined;
let slowestBaseline = undefined;

let meanAnalysis = undefined;
let fastestAnalysis = undefined;
let slowestAnalysis = undefined;
let lapseAnalysis = undefined;

function metricAnalysis() {
    // Fungsi untuk mengambil data baseline PVT dari database
    database.ref('Baseline/' + usernameValue).once('value').then(function(snapshot) {
       meanBaseline = snapshot.val().rata_rata;
       fastestBaseline = snapshot.val().respon_cepat;
       slowestBaseline = snapshot.val().respon_lambat;

       // Fungsi untuk menganalisa rata-rata respon
        if (myMean < (lowThreshold * meanBaseline)) {
            meanAnalysis = 0; //Fit
        } else if (myMean > (highThreshold * meanBaseline)) {
            meanAnalysis = 2; // Fatigue
        } else {
            meanAnalysis = 1; // Fit Dalam Pengawasan
        }
        console.log(myMean);
        console.log(meanBaseline);
        console.log(meanAnalysis);

        // Fungsi untuk menganalisa respon paling cepat
        if (myFastest < (lowThreshold * fastestBaseline)) {
            fastestAnalysis = 0; //Fit
        } else if (myFastest > (highThreshold * fastestBaseline)) {
            fastestAnalysis = 2; // Fatigue
        } else {
            fastestAnalysis = 1; // Fit Dalam Pengawasan
        }
        console.log(myFastest);
        console.log(fastestBaseline);
        console.log(fastestAnalysis)

        // Fungsi untuk menganalisa respon paling lambat
        if (mySlowest < (lowThreshold * slowestBaseline)) {
            slowestAnalysis = 0; //Fit
        } else if (mySlowest > (highThreshold * slowestBaseline)) {
            slowestAnalysis = 2; // Fatigue
        } else {
            slowestAnalysis = 1; // Fit Dalam Pengawasan
        }
        console.log(mySlowest);
        console.log(slowestBaseline);
        console.log(slowestAnalysis)

        // Fungsi untuk menganalisa banyaknya miss
        if (myNumOfLapse < lowLapseThreshold) {
            lapseAnalysis = 0; //Fit
        } else if (myNumOfLapse > highLapseThreshold) {
            lapseAnalysis = 2; // Fatigue
        } else {
            lapseAnalysis = 1; // Fit Dalam Pengawasan
        }
        console.log(myNumOfLapse);
        console.log(lapseAnalysis)

        // Fungsi untuk menentukan seseorang Fit atau tidak dengan metode persentasie dari hasil analisa lainnya
        var sumOfMetricAnalysis = meanAnalysis + fastestAnalysis + slowestAnalysis + lapseAnalysis;
        console.log(sumOfMetricAnalysis);

        var reportAnalysis = sumOfMetricAnalysis / 8;
        console.log(reportAnalysis);

        // Fungsi untuk menampilkan hasil analisa sesuai dengan hasil dari metode persentase yang dipakai
        if (reportAnalysis < 0.5) {
            document.getElementById("reportFit").style.display = "block";
        } else if (reportAnalysis > 0.75) {
            document.getElementById("reportFatigue").style.display = "block";
        } else {
            document.getElementById("reportFDP").style.display = "block";
        }
    })
}

let analisa = document.getElementById("lihatAnalisa");

analisa.addEventListener("click", function() {
    window.location.href="analisa-trial.html";
})

