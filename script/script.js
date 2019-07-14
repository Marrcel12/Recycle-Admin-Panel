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

//login firebase
function login() {
    var userEmail = document.getElementById("email").value;
    var userPass = document.getElementById("pass").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Błąd uwierzytelnienia, skontaktuj się z administratorem");
        console.log(errorCode, errorMessage)
    });
}
//status login
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('logOut').style.visibility = 'visible';
        document.getElementById('logIn').style.visibility = 'hidden';
        var user = firebase.auth().currentUser;

        if (user != null) {
            document.getElementsByClassName('emailArea')[0].style.visibility = 'hidden';
            document.getElementsByClassName('passArea')[0].style.visibility = 'hidden';
            document.getElementById("email").value = "";
            var userPass = document.getElementById("pass").value = "";
            var email_id = user.email;
            document.getElementsByClassName("logStatus")[0].innerHTML = "Welcome User : " + email_id;
            //load list of name
            firebase.firestore().collection("kody").get().then(function (querySnapshot) {
                var i = 0;
                querySnapshot.forEach(function (doc) {
                    console.log(doc.data().name);
                    document.getElementById('itemsName').innerHTML += '<option class=itemFromFirestore ></option>'
                    document.getElementsByClassName('itemFromFirestore')[i].value = doc.data().name
                    i++;
                });
                i = 0;
            });
           

        }

    } else {
        document.getElementsByClassName('emailArea')[0].style.visibility = 'visible';
        document.getElementsByClassName('passArea')[0].style.visibility = 'visible';
        // No user is signed in.
        document.getElementsByClassName('logStatus')[0].innerHTML = "Nie Zalogowany żadny użytkownik"
        document.getElementById('logOut').style.visibility = 'hidden';
        document.getElementById('logIn').style.visibility = 'visible';
    }
});
//log out
function logOut() {
    firebase.auth().signOut();
}


function GetData() {
    var name = document.getElementById("name").value;
    var code = document.getElementById("code").value;
    var bio = document.querySelector('input[name="bio"]:checked').value;

    var itemsIcon = document.getElementsByClassName('icons');
    var icons = [];
    for (var i = 0; i < itemsIcon.length; i++) {
        if (itemsIcon[i].type == 'checkbox' && itemsIcon[i].checked == true)
            icons.push(parseInt(itemsIcon[i].value));
    }
    var material = document.getElementsByClassName('materials')[0].value.split(" ");
    var links = document.getElementsByClassName('links')[0].value.split(" ");

    return [name, code, parseInt(bio), icons, material, links]
}
function delData() {
    var itemsIcon = document.getElementsByClassName('icons');
    for (var i = 0; i < itemsIcon.length; i++) {
        itemsIcon[i].checked = false;
    }
    document.getElementsByClassName('links')[0].value = ""
    document.getElementsByClassName('materials')[0].value = ""
    document.querySelector('input[name="bio"]:checked').checked = false;
    document.getElementById("code").value = "";
    document.getElementById("name").value = "";
}
//check that item exist
document.getElementById('code').addEventListener(
    'focusout', function () {
        firebase.firestore().collection("kody").doc(document.getElementById("code").value).get()
            .then(doc => {
                if (!doc.exists) {
                    return;
                } else {
                    document.getElementById("name").value = doc.data().name


                    var bio = document.getElementsByClassName('bio')
                    for (var i = 0; i < bio.length; i++) {
                        if (bio[i].value == doc.data().bio) {
                            document.getElementsByClassName('bio')[i].checked = true;
                        }
                    }

                    var icons = document.getElementsByClassName('icons')
                    for (var i = 0; i < icons.length; i++) {
                        if (doc.data().icons.includes(parseInt(icons[i].value))) {
                            document.getElementsByClassName('icons')[i].checked = true;
                        }
                    }
                    document.getElementsByClassName('materials')[0].value = String(doc.data().material).replace(",", " ")
                    document.getElementsByClassName('links')[0].value = String(doc.data().links).replace(",", " ")
                }
            })
    }
)
function addToFirestroe(name, code, bio, icons, material, links) {
    //    console.log(name, code, bio, icons, material, links)
    firebase.firestore().collection("kody").doc(code).set({
        name: name,
        icons: icons,
        links: links,
        material: material,
        bio: bio
    })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            alert("Error writing document: ", error);
        });
}




document.getElementsByClassName('itemNameSearch')[0].addEventListener(
    'click', function () {

        var searchName = document.getElementsByClassName('itemName')[0].value;
        firebase.firestore().collection("kody").where("name", "==", searchName)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    document.getElementById("code").value = doc.id
                    document.getElementById("name").value = doc.data().name


                    var bio = document.getElementsByClassName('bio')
                    for (var i = 0; i < bio.length; i++) {
                        if (bio[i].value == doc.data().bio) {
                            document.getElementsByClassName('bio')[i].checked = true;
                        }
                    }

                    var icons = document.getElementsByClassName('icons')
                    for (var i = 0; i < icons.length; i++) {
                        if (doc.data().icons.includes(parseInt(icons[i].value))) {
                            document.getElementsByClassName('icons')[i].checked = true;
                        }
                    }
                    document.getElementsByClassName('materials')[0].value = String(doc.data().material).replace(",", " ")
                    document.getElementsByClassName('links')[0].value = String(doc.data().links).replace(",", " ")
                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });


    })

function sendData() {

    addToFirestroe(GetData()[0], GetData()[1], GetData()[2], GetData()[3], GetData()[4], GetData()[5])

    delData()
}

