let database = firebase.database();

let trialRef = database.ref().child('Trial');

let myArray = [];
let keyArray = [];

trialRef.once('value', function(snapshot) {
    snapshot.forEach(function(item) {
        let keyValue = item.key
        keyArray.push(keyValue);
    })
    console.log(keyArray);

    let trialDatabase = document.getElementById("trialDatabase");
    
    // Fungsi untuk membuat tabel
    let tableBody = document.createElement("tbody");

    for (let i = 0; i < keyArray.length; i++) {
        let row = document.createElement("tr");
        row.style.border = "1px solid black";

        let keyRef = database.ref().child('Trial').child(keyArray[i]);

        let arr = [];

        // Fungsi untuk memanggil data trial untuk setiap node JSON Tree/ id unik dan acak
        keyRef.once('value', function(snapshot) {
            let dateTrial = snapshot.val().tanggal_pengujian;
            let usernameTrial = snapshot.val().nama_responden;
            let pengujianTrial = snapshot.val().jenis_pengujian;
            let shiftTrial = snapshot.val().shift_kerja;
            let lamaTrial = snapshot.val().lama_waktu_pengujian;
            let kantukTrial = snapshot.val().tingkat_kantuk;
            let meanTrial = snapshot.val().rata_rata;
            let fastestTrial = snapshot.val().respon_cepat;
            let slowestTrial = snapshot.val().respon_lambat;
            let lapseTrial = snapshot.val().banyaknya_miss;

            arr.push(dateTrial, usernameTrial, pengujianTrial, shiftTrial, lamaTrial, kantukTrial, meanTrial, fastestTrial, slowestTrial, lapseTrial);

            console.log(arr);

            // Mengassign setiap data trial ke baris dan kolom dalam tabel
            for (let j = 0; j < arr.length; j++) {
                let cell = document.createElement("td");
                cell.style.border = "1px solid black"
                cell.appendChild(document.createTextNode(arr[j]));
                row.appendChild(cell);
            }
        })
        tableBody.appendChild(row);
    }
    trialDatabase.appendChild(tableBody);
})

function getDate() {
    let today = new Date();
    date = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
}

let test = document.getElementById("exportButton");

// Fungsi untuk mengekspor data ke dalam .csv
$( document ).ready(function() {
    test.addEventListener("click", function() {
        getDate();
        $("#trialDatabase").table2csv({
            filename: "database-ukb-" + date + ".csv"
        });
    })
});



  

  

