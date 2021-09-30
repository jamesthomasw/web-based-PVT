// //Script untuk index.html
// //user authentication
// let objPeople =
//     [{
//         username: "ppacoid",
//         password: "ppacoid"
//     }];
    
// // fungsi untuk memvalidasi login dari user
// function validateLogin() {
//     let username = document.getElementById("username").value;
//     let password = document.getElementById("password").value;

//     if (username == "" || password == "") {
//         alert("Username dan Password tidak boleh kosong.");
//         return false;
//     } else {
//         for(i = 0; i < objPeople.length; i++) {
//             if (username == objPeople[i].username && password == objPeople[i].password) {
//                 console.log(username + " " + "login");
//                 alert("Anda Berhasil Login!");
//                 return true;
//             } else {
//                 alert("Terdapat kesalahan! Mohon cek kembali username dan password Anda!")
//                 return false;
//             }
//         }
//     }
// }

//Script untuk welcome-pvt.html
//Mendefinisikan nilai awal variabel
let tipePengujian = "Awal";
let tipeShift = "Pagi";

//Mengubah nilai variabel ketika ada pergantian nilai yg dilakukan oleh user
let jenisPengujian = document.getElementById("jenisPengujian");
jenisPengujian.addEventListener("change", function () {
    tipePengujian = this.value;
    console.log(tipePengujian);
})

let jenisShift = document.getElementById("jenisShift");
jenisShift.addEventListener("change", function () {
    tipeShift = this.value;
    console.log(tipeShift)
})

//fungsi untuk mengambil/menyimpan data-data awal pengukuran PVT Trial
function getinfo() {
    let username = document.getElementById("username").value;

    if (username == "") {
        alert("Harap untuk mengisi setiap data yang diperlukan.");
        return false;
    } else {
        localStorage.setItem("username", username);
        localStorage.setItem("pengujianValue", tipePengujian);
        localStorage.setItem("shiftValue", tipeShift);
        return true;
    }
}

let linkBaseline = document.getElementById("linkBaseline");

//Ketika user mengklik link baseline, maka jenis pengukuran menyimpan value Baseline
linkBaseline.addEventListener("click", function() {
    tipePengujian = "Baseline";
    localStorage.setItem("pengujianBaseline", tipePengujian);
})

// Pengaturan icon settings untuk settings-trial.html
let pengaturan = document.getElementById("settingsButton");
let iconPengaturan = document.getElementById("gear");

pengaturan.addEventListener("click", function() {
    window.location.href="settings-trial.html";
})

iconPengaturan.addEventListener("click", function() {
    window.location.href="settings-trial.html";
})


