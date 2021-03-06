

const Tavern = (self) =>{
    state = {   
    //element holders
			grid : $(".grid"),
			signInBtn : $("#signin"),
			signOutBtn : $("#signout"),
			btnFilter : $(".filterBtn"),
			btnSort : $(".sortBtn"),
			btnGroup : $(".sortBtn, .filterBtn"),
			pageTitle : $("#pageTitle"),
			btnShuffle : $('#btnShuffle'),
			
			notRendered : true,
			iso : null,

			tagList : [],
			randomLinkTitle: ["Linkerest", "Linkali", "Linkahorn", "Linkimanjaro", "Linkuji"],
			randomGridClass : ["", "grid-item--width2", "grid-item--height2"],
			refList : ["Categories", "Tags"],
			
			init: (self) => {
				state.self = self;	
				state.self.initFirebase( state.self.onSignIn, state.self.onSignOut)				  
					.then(() => console.log('firebase started'))
					.catch((e) => console.log(e))
			}
			
		}
		
		//event handlers
		state.signInBtn.on("click", function(e){
				state.self.signIn('g', state.self.bugo);
		})

		state.signOutBtn.on("click", function(e){
				state.self.signOut();
		})  
		
		state.btnFilter.hide();  
		state.btnSort.hide();  
	
		return Object.assign(
			
			{init: state.init},
			
			fireStuff.initFirebase(state),
			fireStuff.onAuthStateChanged(state),
			fireStuff.signIn(state),
			fireStuff.signOut(state),
			fireStuff.createRefs(state),
			
			onSignIn(state),
			onSignOut(state),
			getTags(state),			
			loadItems(state),
			startIso(state),
			renderCats(state),
			
			bugo(state)
		)
}
//mandatory signIn / signOut functions
const onSignOut = (state) => ({
	onSignOut : () => {
		state.signInBtn.show();
		state.signOutBtn.hide();
	}
});

const onSignIn = (state) => ({
	onSignIn : () => {
		state.self.createRefs(state.refList);
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
    getTags :  () => { state.TagsRef.once("value", function(data){
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
		
		
		var randNum = Math.floor(Math.random() * (state.randomLinkTitle.length));
		state.pageTitle.text(state.randomLinkTitle[randNum]);
		
    //retrive the tags first
    state.self.getTags();    
    
    state.CategoriesRef.once("value", function(data){
      
			var cats = data.val();
			var len = Object.keys(cats).length;
			console.log(cats);  
			var count = 0;			 
      for(let i in cats){
								count += 1;
							  var tagInfo = cats[i].Tags              
							  if(count == len){
									state.self.renderCats(i, tagInfo, true);
								}	
								 else{
									 	state.self.renderCats(i, tagInfo);
								}                           
        }		       
			
    }).then(function(){
			//console.log('completed');			
		})
	}
});

//Render the Categories on the Grid
const renderCats = (state) => ({
		renderCats : (title, tags, final) => {
			
			//get the tags associated with each Category and put them in a string
			var tempTags = "";
			for(var i in tags){
					tempTags += " " + state.tagList[tags[i]];
			}
			//create a random grid length/height
			var randNum = Math.floor(Math.random() * (state.randomGridClass.length));
			var rando = state.randomGridClass[randNum];
			//create the grid div and add classes
			var cataLink = $("<a>", {
					href: "/cats.html#" + title       
			});
			var linkDiv = $("<div>",{
				 class: "grid-item " + rando + tempTags,
				 html: "<img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/orange-tree.jpg' />" +
				"<p class='name'>" + title + "</p>"
				
			});
			//append to the grid
			linkDiv.appendTo(cataLink);
			cataLink.appendTo(state.grid); 
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
			 //console.log($);
     
			 state.iso =  state.grid.isotope({
                  // options
                  itemSelector: '.grid-item',
                  layoutMode: 'masonry',	
                    getSortData: {
                        name: '.name',                       
                        number: '.number parseInt'    
                 }
					})
			
    //create filter button handler
     state.btnFilter.on("click", "a", function() {
        var filterValue = $(this).attr('data-filter'); 			 
        state.iso.isotope({ filter: filterValue });        
    });
    //create sort button handler
    state.btnSort.on( 'click', 'button', function() {
          var sortByValue = $(this).attr('data-sort');
          state.iso.isotope({ sortBy: sortByValue });
    });
			 	 
		state.btnShuffle.on( 'click', function() {
         state.iso.isotope('shuffle');
				var randNum = Math.floor(Math.random() * (state.randomLinkTitle.length));
				state.pageTitle.text(state.randomLinkTitle[randNum]);
    });	 
    //create checked class button toggler for each group
//    state.btnGroup.each( function( i, buttonGroup ) {
//        var $buttonGroup = $( buttonGroup );
//        $buttonGroup.on( 'click', 'button', function() {
//            $buttonGroup.find('.is-checked').removeClass('is-checked');
//            $( this ).addClass('is-checked');
//        });
//    });
    
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