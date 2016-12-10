

const Tavern = (self) =>{
    state = {   
    //element holders
			grid : $(".grid"),
			signInBtn : $("#signin"),
			signOutBtn : $("#signout"),
			btnFilter : $(".filterBtn"),
			btnSort : $(".sortBtn"),
			btnGroup : $(".sortBtn, .filterBtn"),
			
			notRendered : true,
			iso : null,

			tagList : [],
			randomGridClass : ["", "grid-item--width2", "grid-item--height2"],
			
			init: (self) => {
				state.self = self;	
				state.self.initFirebase();
			}
			
		}
		
		//event handlers
		state.signInBtn.on("click", function(e){
				state.self.signIn('g', state.self.bugo);
		}),

		state.signOutBtn.on("click", function(e){
				state.self.signOut();
		}),  
		
		state.btnFilter.hide();  
		state.btnSort.hide();  
	
		return Object.assign(
			
			{init: state.init},
			
			fireStuff.initFirebase(state),
			fireStuff.onAuthStateChanged(state),
			fireStuff.signIn(state),
			fireStuff.signOut(state),
			
			onSignIn(state),
			onSignOut(state),
			getTags(state),			
			loadItems(state),
			startIso(state),
			renderCats(state),		
			bugo(state)
		)
}

const onSignOut = (state) => ({
	onSignOut : () => {
		state.signInBtn.show();
		state.signOutBtn.hide();
	}
});

const onSignIn = (state) => ({
	onSignIn : () => {
		console.log('signed in!');
		state.signOutBtn.show();
		state.signInBtn.hide();
		if(state.notRendered){
			  state.notRendered = false;
				state.self.loadItems();
		}							
	}
});

const getTags = (state) => ({    
    //var self = this;
    //loads up the tags from firebase
    getTags :  () => { state.tagsRef.once("value", function(data){
					tags = data.val();       
					for(var i in tags){
							state.tagList.push(tags[i]);
						}
					 //self.bugo(self.tagList);
					});
				}
});

////load all the categories from firebase
const loadItems = (state) => ({
	loadItems: ()=>{	
    //retrive the tags first
    state.self.getTags();    
    
    state.categories.once("value", function(data){
        
			var cats = data.val();
			var len = Object.keys(cats).length;
			var count = 0;			 
      for(let i in cats){
            var info = firebase.database().ref("Categories/" + i + "/Tags").once("value", (data) =>{             count += 1;   
                var info = data.val();
							  if(count == len){
									state.self.renderCats(i, info, true);
								}	
								 else{
									 	state.self.renderCats(i, info);
								 }
                
            }).then(function(e){
                            
            });       
        }		       
			   //setTimeout(state.self.startIso, 500);
    }).then(function(){
			//console.log('completed');			
		})
	}
});

//Render the Categories on the Grid
const renderCats = (state) => ({
		renderCats : (text, tags, final) => {
			//get the tags associated with each Category and put them in a string
			var tempTags = "";
			for(var i in tags){
					tempTags += " " + state.tagList[i - 1];
			}
			//create a random grid length/height
			var randNum = Math.floor(Math.random() * (state.randomGridClass.length));
			var rando = state.randomGridClass[randNum];
			//create the grid div and add classes
			var cata = $("<a>", {

					href: "/cats.html#" + text       
			});
			var link = $("<div>",{
				 class: "grid-item " + rando + tempTags,
				 html: "<p class='name'>" + text + "</p><p class='number'>" + randNum + "</p>",
				 text: text
			});

			//append to the grid
			link.appendTo(cata);
			cata.appendTo(state.grid); 
			//if final div is appended start iso
			if(final){
				state.self.startIso();
			}
		}	
})

//start the isotope plugin
const startIso = (state) => ({ 
	   startIso: () => {
     //var self = this;
    //initialize isotope
     state.iso = state.grid.isotope({
                  // options
                  itemSelector: '.grid-item',
                  layoutMode: 'fitRows',
                    getSortData: {
                        name: '.name',                       
                        number: '.number parseInt'    
                 }
    });
    //create filter button handler
     state.btnFilter.on("click", "button", function() {
        var filterValue = $(this).attr('data-filter');        
        state.iso.isotope({ filter: filterValue });        
    });
    //create sort button handler
    state.btnSort.on( 'click', 'button', function() {
          var sortByValue = $(this).attr('data-sort');
          state.iso.isotope({ sortBy: sortByValue });
    });
    //create checked class button toggler for each group
    state.btnGroup.each( function( i, buttonGroup ) {
        var $buttonGroup = $( buttonGroup );
        $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
        });
    });
    
    state.btnFilter.show();
    state.btnSort.show();
		 }
});

//Debugging
const bugo = (state) =>({
    bugo : (bugger) => {console.log(bugger);}
});
//load Tavern on Load
$(document).ready(function(){
	  
    window.Tball = Tavern();	  
    Tball.init(Tball);
});