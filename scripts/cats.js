const CatLinks = (self) => {
	state = {
		
		signInBtn : $("#signin"),
		signOutBtn : $("#signout"),
		pageTitle : $(".mdl-layout-title"),
		linkList : $("#linkList"),
		tabButtons: $(".mdl-layout__tab-bar"),
		searchField: $("#search-field"),
		
		
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
		updateLink(state),
		validateForm(state),
		
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
	  state.self.createRefs(["Pages", "Categories"]);
		console.log('signed in!');
		state.signOutBtn.show();
		state.signInBtn.hide();
		
		if(state.notRendered){
			  state.notRendered = false;
			
			state.CategoriesRef.once("value").then(function(snap){
				if(snap.child(state.roomName).exists()){					
					state.self.loadItems();
				}
				else{
					console.log("no such link page");
				}
			}).catch(function(){
				
			});				
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
		
			 state.tabButtons.on("click", "a", function() {
				 var filterValue = $(this).attr('data-filter'); 				 
				 var tempLinks = [];
				 if(filterValue === "showAll"){
					 tempLinks = state.linkArray; 
				 }
				 else if(filterValue === "noVisit"){
					 tempLinks = state.self.filterLinks("visited", false, true);
				 }
				 else{
					 tempLinks = state.self.filterLinks(filterValue, true, true);
				 }
				  state.self.clearLinks();
					state.self.renderAllLinks(tempLinks);
    		});
			
			 state.searchField.on("input",function(){
				 var filterValue = $(this).val();
				 var tempLinks = state.self.filterLinks(filterValue, null, false);
				 state.self.clearLinks();
					state.self.renderAllLinks(tempLinks);
			 });
			
			state.linkList.on("click", "i", function(){
				var id = $(this).attr("id");
				var linkInfo = (state.self.filterLinks("key", id, true));
				$(".mdl-layout__tab").removeClass("is-active");
				$('.mdl-layout__tab-panel').removeClass('is-active');
				
				$("#linkName").val(linkInfo[0].key);
				$("#linkUrl").val(linkInfo[0].href);
				$("#linkDescrip").val(linkInfo[0].description);
				
				if(linkInfo[0].visited){					
					$("#visitedLabel").addClass('is-checked');
				}
				else{
					$("#visitedLabel").removeClass('is-checked');
				}
			//	$("#sample1").attr();
				$("#addLinkTab").addClass("is-active");				 
				$('#editTab').addClass('is-active');
			})
			
			$("#updateLink").on("click", function(){
				
				var id = $("#linkName").val();
				var descript = $("#linkDescrip").val();
				var url = $("#linkUrl").val();
				var visit = $("#visitedLabel").hasClass('is-checked');
				
				var formTest = [];
				formTest.push(id, descript, url);				
				
				if(state.self.validateForm(formTest)){
					state.self.updateLink(id, descript, url, visit);
				}
				else{
					console.log("invalid data");
				}
				
				
			})
				
		})
	}
})

const validateForm = (state) => ({
	validateForm : (data) => {
		for(var i = 0; i < data.length; i++){
			console.log(data[i]);
			if(!data[i]){
				return false;
			}						
		}
		return true;
	}
})

const updateLink = (state) => ({
	updateLink : (id, descript, url, visit) => {
		state.PagesRef.child(state.roomName + "/Links/" + id)
				.set({ 
				description: descript,
				href: url,
				visited: visit
			}).then(function(data){
			 console.log('updated!');
		})
		}
});

const filterLinks = (state) =>({
	filterLinks : (filterKey, filterValue, filterByKey) => {		
		var tempLinks = [];
		var filterWord = filterKey;
		
		const filterVisited = (link) => {
			return link[filterWord] == filterValue;
		}		
		
		const filterDescription = (link) =>{			
			if((link.description + link.key).indexOf(filterWord) !== -1){
				return true;
			}
		}
		
		var filterFunc = filterDescription;
		if(filterByKey){
			var filterFunc = filterVisited;
		}
		
		return state.linkArray.filter(filterFunc);			
				
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
		var visited = "";
		if(linkData.visited){
			visited = " was-visited";
		}
		//console.log(linkData);
		
		var listItem = $("<li>", {
			class: "mdl-list__item mdl-list__item--three-line"			
		})		
		var span1 = $("<span>",{
			class: "mdl-list__item-primary-content",
			html: "<i class='material-icons mdl-list__item-avatar" + visited + "'>http</i><span>" + 
			linkData.key + "</span><span class='mdl-list__item-text-body'>" +
			linkData.description + "</span>"
		});
		
//		var span2 = $("<span>", {
//			class: "mdl-list__item-primary-content",
//			html: "<span class='mdl-list__item-secondary-action'><label class='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect' for='list-checkbox-2'><input type='checkbox' id='list-checkbox-2' class='mdl-checkbox__input' checked /></label> </span>"
//		});
		
		
		var span2 = $("<span>", {
			class: "mdl-list__item-primary-content",
			html: "<span class='mdl-list__item-secondary-content'><a class='mdl-list__item-secondary-action'><i id='" + linkData.key +  "' class='material-icons build'>build</i></a></span>"
		});
		
		listItem.append(span1, span2);
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






