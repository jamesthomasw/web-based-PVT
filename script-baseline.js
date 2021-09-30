let database = firebase.database();

// Memanggil jenis pengukuran Baseline dari halaman welcome-pvt.html
let pengujianBaseline = localStorage.getItem("pengujianBaseline")

// Mendefinisikan nilai awal kantuk untuk pengukuran baseline
let kantukBaseline = 1;

// Mengubah nilai kantuk ketika ada pergantian nilai oleh user
let kssBaseline = document.getElementById("kssBaseline");
kssBaseline.addEventListener("change", function() {
    kantukBaseline = this.value;
})

// Mendefinisikan nilai awal shift kerja untuk pengukuran baseline
let shiftBaseline = "Pagi";

// Mengubah nilai shift kerja ketika ada pergantian nilai oleh user
let shift = document.getElementById("shiftBaseline");
shift.addEventListener("change", function() {
    shiftBaseline = this.value;
})

// Mendefinisikan nilai awal variabel untuk fungsi setInterval()
let testInterval = 0;
let trialInterval = 0;

let testTime = null;

// Define var for hold test status value
let testStatus = "stopped";

// DEFINE VAR TO HOLD TIMER STATUS VALUE
let displayStatus = "hidden";
let timerStatus = "stopped";

// Mendefinisikan DOM untuk mengidentifikasi area user memberikan input
let screen = document.getElementById("screen");

let hidInterval, randInterval = 0;

// Define var to hold test length time value
let testLength = 20000;

// Mengubah nilai lama waktu pengukuran ketika ada pergantian nilai oleh user
let waktuBaseline = document.getElementById("waktuBaseline");
waktuBaseline.addEventListener("change", function() {
    testLength = this.value;
})

// Define var to identify when to start and stop counting the timer
let stopCounting = false;

// Define var to hold button property
let testButtonBaseline = document.getElementById("testButtonBaseline");

// Adding Event Listener to the button for trigger input from the user
testButtonBaseline.addEventListener("click", testStart);

// Fungsi untuk mengecek status display terlebih dahulu
function displayCheck() {
    if (displayStatus == "hidden") {
        document.getElementById("timer").style.display = "block"
        document.getElementById("timer").innerHTML = "ERR";
        setTimeout(function() {
            document.getElementById("timer").style.display = "none";
        },500)
        clearInterval(randInterval);
        pvtTrial();
    } else {
        timerStop();
    }
}

//function to get date and time value
let dateTime = undefined;

function getDateTime() {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date + ' ' + time;
}

// function to start the test
function testStart() {
    getDateTime();

    // fungsi untuk menyimpan data ke dalam database dengan id unik yaitu id pekerja tersebut
    database.ref('Baseline/').child(usernameBaseline).set({
        tanggal_pengujian: dateTime,
        nama_responden: usernameBaseline,
        jenis_pengujian: pengujianBaseline,
        shift_kerja: shiftBaseline,
        tingkat_kantuk: kantukBaseline,
        lama_waktu_pengujian: testLength,
    })
    
    document.getElementById("testButtonBaseline").style.display = "none";
    document.getElementById("siapBaseline").style.display = "none";
    document.getElementById("license").style.display = "none";
    document.getElementById("screen").style.display = "block";

    // Fungsi untuk menjalankan timer test yang mengindikasi counter waktu pengujian secara keseluruhan
    let startTime = Date.now();

    testInterval = setInterval(function() {
        let testTime = Date.now() - startTime;
        document.getElementById("test").innerHTML = testTime;
    }, 1);
    testStatus = "started"
    console.log(testStatus);

    pvtTrial();

    testStop();
}

// Fungsi program PVT
function pvtTrial() {

    timerStart();
    screen.addEventListener("click", displayCheck);
    
}

function timerStart() {

    // Mendefinisikan waktu random
    let rand = Math.floor(Math.random() * (10 - 2 + 1)) + 2;

    // Fungsi untuk memunculkan display dan memulai timer baseline ketika waktu random telah tercapai
    randInterval = setTimeout(function () {
        document.getElementById("display").style.display = "block";
        displayStatus = "displayed";

        // Fungsi untuk memulai counter timer baseline
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

// Array untuk menyimpan data pengukuran baseline PVT
let myData = [];

// Fungsi untuk menghentikan timer Baseline
function timerStop() {
    document.getElementById("display").style.display = "none";
    displayStatus = "hidden";
    clearInterval(trialInterval);
    timerStatus = "stopped";
    document.getElementById("timer").style.display = "block";

    let rtValue = document.getElementById("timer").innerHTML;
    console.log(rtValue);
    // Apabila ada nilai respon yang < 100 maka false start
    if (rtValue < 100) {
        document.getElementById("timer").innerHTML = "FS";
    }
    console.log(timerStatus);

    // Menyimpan nilai respon ke dalam array yang telah disediakan
    myData.push(rtValue);

    console.log(myData);

    // Fungsi untuk menyembunyikan timer baseline
    hidInterval = setTimeout(function() {
        document.getElementById("timer").style.display = "none"
        displayStatus = "hidden";
        if (testTime < testLength) {
            pvtTrial();
        }
    }, 500);
}

// function to stop the test
function testStop() {

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
            
            // Fungsi untuk mengolah data pengukuran baseline
            getOutcomeMetric();

            // Fungsi untuk menyimpan data pengukuran baseline dengan mengupdate id unik sebelumnya
            database.ref('Baseline/').child(usernameBaseline).update({
                respon_data: myData,
                rata_rata: myMean,
                respon_cepat: myFastest,
                respon_lambat: mySlowest,
                banyaknya_miss: myNumOfLapse
            })

            // Menampilkan halaman terima kasih
            screen.style.display = "none";
            document.getElementById("thankYouBaseline").style.display = "block";
            document.getElementById("license").style.display = "block";
            setTimeout(function() {
                document.getElementById("viewResultBaseline").style.display = "block";
            }, 1000);
        }
    }, testLength);
}

// Mendefinisikan variabel untuk menyimpan id pekerja yg mengikuti pengukuran baseline
let usernameBaseline = undefined;

let instructionButtonBaseline = document.getElementById("instructionButtonBaseline");

instructionButtonBaseline.addEventListener("click", function() {

    // Fungsi untuk mengverifikasi id pekerja telah diisi atau belum
    if (document.getElementById("username").value == "") {
        alert("Harap mengisi data yang diperlukan!")
        return false;
    } else
    // Menyimpan nilai id pekerja dalam variabel
    usernameBaseline = document.getElementById("username").value;

    // Ketika tombol 'MULAI' ditekan maka akan berpindah ke halaman instruksi baseline
    document.getElementById("pvtBaseline").style.display = "none";
    document.getElementById("instructionButtonBaseline").style.display = "none";
    document.getElementById("instructionBaseline").style.display = "block";
    document.getElementById("siapButtonBaseline").style.display = "block";
    console.log(testLength);
})

let siapButtonBaseline = document.getElementById("siapButtonBaseline");

// Ketika tombol 'SIAP' ditekan maka akan berpindah ke halaman siap baseline
siapButtonBaseline.addEventListener("click", function() {
    document.getElementById("instructionBaseline").style.display = "none";
    document.getElementById("siapButtonBaseline").style.display = "none";
    document.getElementById("siapBaseline").style.display = "block";
    document.getElementById("testButtonBaseline").style.display = "block";
})

// Mendefinisikan nilai awal variabel olahan data pengukuran baseline
let myMean = 0;
let myFastest = 0;
let mySlowest = 0;
let myNumOfLapse = 0;

// Fungsi untuk mengolah data pengukuran baseline
function getOutcomeMetric() {
    // Jumlah total nilai respon pengukuran baseline
    let sum = 0
    for (let i = 0; i < myData.length; i++) {
        sum += parseInt(myData[i]);
    }
    console.log(sum);

    // Rata-rata
    var avg = sum / myData.length;
    console.log(avg);
    myMean = avg.toFixed(2);

    //Fungsi untuk menyortir data menjadi urutan nilai paling kecil hingga nilai paling besar
    let newArray = [...myData];

    newArray.sort(function(a, b) {
        return a - b;
    })
    console.log(newArray)

    // Jumlah data yang harus diambil ketika ingin menghitung hasil respon paling cepat dan lambat
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
        // Ketika nilai respon > 500 maka akan dihitung sebagai miss
        if (newArray[i] > 500) {
            lapse.push(newArray[i]);
        }
    }
    // Nilai banyaknya miss diambil dari jumlah data yang dihitung sebagai miss
    myNumOfLapse = lapse.length;
}

let resultBaseline = document.getElementById("viewResultBaseline");

// Fungsi untuk menampilkan hasil olahan data pengukuran baseline
resultBaseline.addEventListener("click", function() {

    document.getElementById("thankYouBaseline").style.display = "none";
    document.getElementById("resultBaseline").style.display = "block";
    
    document.getElementById("dateTime").innerHTML = dateTime;
    document.getElementById("usernameResult").innerHTML = usernameBaseline;
    document.getElementById("tipePengujianResult").innerHTML = pengujianBaseline;
    document.getElementById("tipeShiftResult").innerHTML = shiftBaseline;

    document.getElementById("meanValue").innerHTML = myMean;
    document.getElementById("fastestValue").innerHTML = myFastest;
    document.getElementById("slowestValue").innerHTML = mySlowest;
    document.getElementById("numOfLapse").innerHTML = myNumOfLapse;
})
