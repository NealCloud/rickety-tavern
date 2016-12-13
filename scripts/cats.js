const CatLinks = (self) => {
	state = {
		
		signInBtn : $("#signin"),
		signOutBtn : $("#signout"),
		pageTitle : $(".mdl-layout-title"),
		linkList : $("#linkList"),
		tabButtons: $(".mdl-layout__tab-bar"),
		
		roomName : window.location.hash.substr(1),
		notRendered : true,
		
		linkArray : [],
		
		init: (self) => {
				state.self = self;			  
				state.self.initFirebase(state.self.onSignIn, state.self.onSignOut)
					.then(() => {})
					.catch((e) => console.log(e))
			}
	}
	
		state.signInBtn.on("click", function(e){
				state.self.signIn('google', state.self.bugo);
		});

		state.signOutBtn.on("click", function(e){
				state.self.signOut();
		});
	
	return Object.assign(
		{init: state.init},
		fireStuff.initFirebase(state),
		fireStuff.onAuthStateChanged(state),
		fireStuff.signIn(state),
		fireStuff.signOut(state),
		fireStuff.createRefs(state),
		
		onSignOut(state),
		onSignIn(state),
		loadItems(state),
		renderLink(state),
		renderAllLinks(state),
		filterLinks(state),
		clearLinks(state),
		
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
	  state.self.createRefs(["Pages"]);
		console.log('signed in!');
		state.signOutBtn.show();
		state.signInBtn.hide();
		
		if(state.notRendered){
			  state.notRendered = false;
				state.self.loadItems();
		}							
	}
});

const loadItems = (state) => ({
	loadItems: ()=>{	     
		state.pageTitle.text(state.roomName + " Links");
    //console.log(state.PagesRef, state.roomName);
    state.PagesRef.child(state.roomName).once("value", function(data){
      
			var pageData = data.val();
			var len = Object.keys(pageData.Links).length;
			//console.log(pageData);  
			var count = 0;			 
      for(let i in pageData.Links){
								count += 1;
								
							  var linkInfo = pageData.Links[i];	
								linkInfo.key = i;
								state.linkArray.push(linkInfo);
                        
        }		       
			
    }).then(function(){
			console.log('completed load');
			
			state.self.renderAllLinks(state.linkArray);
			
			$("#cleariT").on("click", function() {
				console.log("clearing");
        state.self.clearLinks(); 
    	});
			
			 state.tabButtons.on("click", "a", function() {
				 var filterValue = $(this).attr('data-filter'); 				 
				 state.self.filterLinks(filterValue);        
    		});
		})
	}
})

const filterLinks = (state) =>({
	filterLinks : (filterWord) => {		
		var tempLinks = [];
		var filterFunc = null;
		var filterWord = "";
		
			const filterVisted = (link) => {
			return link.visted;
		}
		
		const filterDescription = (link) =>{
			console.log(link.description.indexOf("boogle"));
			if(link.description.indexOf(filterWord) !== -1){
				return true;
			}
		}
		
		switch(filterWord){
			case "visited" : 
				filterFunc = filterDescription;
				break;
			default:
				filterFunc = filterDescription;
				filterWord = "boogle";
		}
		
	
		
		tempLinks = state.linkArray.filter(filterFunc);
				console.log(tempLinks);
		
		state.self.clearLinks();
		state.self.renderAllLinks(tempLinks);
	}	
});

const clearLinks = (state) =>({
	clearLinks : () =>{		
		state.linkList.html("");
	}	
});			

const renderAllLinks = (state) =>({
	renderAllLinks : (linkArray) => {
		var len = linkArray.length;
		 for(let i = 0; i < len; i++){	
					if(i == len){
							state.self.renderLink(linkArray[i], true);
					}	
			 
					 else{
							state.self.renderLink(linkArray[i]);
					}                           
			}		       
	}
	
});

const renderLink = (state) => ({
	renderLink : (linkData, finalCount) => {
		
		//console.log(linkData);
		
		var listItem = $("<li>", {
			class: "mdl-list__item mdl-list__item--three-line"			
		})		
		var span1 = $("<span>",{
			class: "mdl-list__item-primary-content",
			html: "<i class='material-icons mdl-list__item-avatar'>http</i><span>" + 
			linkData.key + "</span><span class='mdl-list__item-text-body'>" +
			linkData.description + "</span>"
		});
		
//		var span2 = $("<span>", {
//			class: "mdl-list__item-primary-content",
//			html: "<span class='mdl-list__item-secondary-action'><label class='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect' for='list-checkbox-2'><input type='checkbox' id='list-checkbox-2' class='mdl-checkbox__input' checked /></label> </span>"
//		});
		
		
		var span2 = $("<span>", {
			class: "mdl-list__item-primary-content",
			html: "<span class='mdl-list__item-secondary-content'><a class='mdl-list__item-secondary-action' href='#'><i class='material-icons'>star</i></a></span>"
		});
		
		span1.appendTo(listItem);
		span2.appendTo(listItem);
		listItem.appendTo(linkList);
		
		if(finalCount){
			componentHandler.upgradeDom();
		}
				

	}	
})

const bugo = (state) => ({
	bugo: (dabug) => {
		 console.log(dabug);
	}
})


	
$(document).ready(function(){
	  
    window.WebLinker = CatLinks();	  
    WebLinker.init(WebLinker);
});	






