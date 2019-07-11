// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBklJJ8VkRWXHh24R0t6P68hFSx15R5_-Q",
    authDomain: "recycle-a220b.firebaseapp.com",
    databaseURL: "https://recycle-a220b.firebaseio.com",
    projectId: "recycle-a220b",
    storageBucket: "recycle-a220b.appspot.com",
    messagingSenderId: "417297682309",
    appId: "1:417297682309:web:062f30b123605ae9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//custom code
// qr camera
function openQRCamera(node) {
    var reader = new FileReader();
    reader.onload = function () {
        node.value = "";
        qrcode.callback = function (res) {
            if (res instanceof Error) {
                alert("No QR code found. Please make sure the QR code is within the camera's frame and try again.");
            } else {
                node.parentNode.previousElementSibling.value = res;
            }
        };
        qrcode.decode(reader.result);
    };
    reader.readAsDataURL(node.files[0]);
}
// FireBase
firebase.firestore().collection("kody").doc("5901939103075").set({
    name: "Skyr jogurt pitny Wanilia",
    icons: [1, 2, 3],
    links: ["http://skyr.pl"],
    material: ["Pet"],
    bio: 2
})
    .then(function () {
        console.log("Document successfully written!");
    })
    .catch(function (error) {
        console.error("Error writing document: ", error);
    });
