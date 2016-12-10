

function Tavern(){
   var self = this;      
    //element holders
    this.grid = $(".grid");
    this.signInBtn = $("#signin");
    this.signOutBtn = $("#signout");
    this.btnFilter = $(".filterBtn");
    this.btnSort = $(".sortBtn");
    this.btnGroup = $(".sortBtn, .filterBtn");
    
    this.iso = null;
    
    this.tagList = [];
    this.randomGridClass = ["", "grid-item--width2", "grid-item--height2"];
    //event handlers
    this.signInBtn.on("click", function(e){
        self.signIn();
    });
     this.signOutBtn.on("click", function(e){
        self.signOut();
    });  
    
    this.btnFilter.hide();  
    this.btnSort.hide();   
   this.initFirebase(); 
}
//intialize firebase 
Tavern.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  //create refs to the categories/tags      
  this.categories = firebase.database().ref("Categories");
  this.tagsRef = firebase.database().ref("Tags");  
  // Initiates Firebase auth and listen to auth state changes.
  //this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));  
	this.auth.onAuthStateChanged( (user) => this.onAuthStateChanged(user));
};
//gets the tags from firebase
Tavern.prototype.getTags = function(){    
    var self = this;
    //loads up the tags from firebase
    this.tagsRef.once("value", function(data){
      tags = data.val();       
      for(var i in tags){
          self.tagList.push(tags[i]);
      }
       //self.bugo(self.tagList);
    }); 
}

Tavern.prototype.onAuthStateChanged = function(user){
    //check user singed in
    console.log("Auth has changed!");
    if(user){
			console.log('signed in!');
        this.signInBtn.hide();
        this.loadItems();
    }
    //show sign in button
    else{
        this.signInBtn.show();
    }
}
//sign into firebase
Tavern.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
    
  this.auth.signInWithPopup(provider)
  .catch(function(e){
      console.log("failed to log in");
  });
};
//signout firebase function
Tavern.prototype.singOut = function() {
  this.auth.signOut();
};
//load all the categories from firebase
Tavern.prototype.loadItems = function(){
    var self = this;
    //retrive the tags first
    this.getTags();    
    
    this.categories.once("value", function(data){
        
        var cats = data.val();        
        for(let i in cats){
            var info = firebase.database().ref("Categories/" + i + "/Tags").once("value", function(data){                
                var info = data.val();
                self.renderCats(i, info);
            }).then(function(e){
                 //self.bugo('finished', e);                 
            });       
        }
        setTimeout(self.startIso.bind(self), 500);
    })
}
//start the isotope plugin
Tavern.prototype.startIso = function(){     
     var self = this;
    //initialize isotope
     this.iso = this.grid.isotope({
                  // options
                  itemSelector: '.grid-item',
                  layoutMode: 'fitRows',
                    getSortData: {
                        name: '.name',                       
                        number: '.number parseInt'    
                 }
    });
    //create filter button handler
     this.btnFilter.on("click", "button", function() {
        var filterValue = $(this).attr('data-filter');        
        self.iso.isotope({ filter: filterValue });        
    });
    //create sort button handler
    this.btnSort.on( 'click', 'button', function() {
          var sortByValue = $(this).attr('data-sort');
          self.iso.isotope({ sortBy: sortByValue });
    });
    //create checked class button toggler for each group
    this.btnGroup.each( function( i, buttonGroup ) {
        var $buttonGroup = $( buttonGroup );
        $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
        });
    });
    
    this.btnFilter.show();
    this.btnSort.show();
}
//Render the Categories on the Grid
Tavern.prototype.renderCats = function(text, tags){
    //get the tags associated with each Category and put them in a string
    var tempTags = "";
    for(var i in tags){
        tempTags += " " + this.tagList[i - 1];
    }
    //create a random grid length/height
    var randNum = Math.floor(Math.random() * (this.randomGridClass.length));
    var rando = this.randomGridClass[randNum];
    //create the grid div and add classes
    var cata = $("<a>", {
       
				href: "/cats.html#" + text       
    });
	  var link = $("<div>",{
			 class: "grid-item " + rando + tempTags,
			 html: "<p class='name'>" + text + "</p><p class='number'>" + randNum + "</p>",
			 text: "catta"
		});
	  
    //append to the grid
	  link.appendTo(cata);
    cata.appendTo(this.grid);  
}
//Debugging
Tavern.prototype.bugo = function(bugger){
    console.log(bugger);
}
//load Tavern on Load
$(document).ready(function(){
    window.Tball = new Tavern();
   
});
