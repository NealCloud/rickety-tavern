var roomName = window.location.hash.substr(1);

console.log(roomName);

var autho = firebase.auth();

var changedIt = function(user){
    //check user singed in
    console.log("Auth has changed!");
    if(user){
       console.log("singed  in!");
    }
    //show sign in button
    else{
       console.log("signed out")
    }
}

autho.onAuthStateChanged(changedIt);
var database = firebase.database();
var storage = firebase.storage();

$("<div>",{
	text: roomName
}).appendTo("body");




