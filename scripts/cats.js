const CatLinks = (self) => {
	state = {
		
		signInBtn : $("#signin"),
		signOutBtn : $("#signout"),
		
		roomName : window.location.hash.substr(1),
		notRendered : true,		
		
		init: (self) => {
				state.self = self;	
				state.self.initFirebase(state.self.onSignIn, state.self.onSignOut)
					.then(() => {})//state.self.createRefs())
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
    console.log(state);
    state.PagesRef.child(state.roomName).once("value", function(data){
      
			var cats = data.val();
			var len = Object.keys(cats).length;
			console.log(cats);  
			var count = 0;			 
      for(let i in cats){
								count += 1;
							  var tagInfo = cats[i].Tags              
							  if(count == len){
										//state.self.renderCats(i, tagInfo, true);
								}	
								 else{
									 	//state.self.renderCats(i, tagInfo);
								}                           
        }		       
			
    }).then(function(){
			console.log('completed');			
		})
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






