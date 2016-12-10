const CatLinks = (self) => {
	state = {
		
		roomName : window.location.hash.substr(1),
		notRendered : false,
		init: (self) => {
				state.self = self;	
				state.self.initFirebase(state.self.onSignIn, state.self.onSignOut)
					.then(() => {})//state.self.createRefs())
					.catch((e) => console.log(e))
			}
	}
	
	return Object.assign(
		{init: state.init},
		fireStuff.initFirebase(state),
		fireStuff.onAuthStateChanged(state),
		fireStuff.signIn(state),
		fireStuff.signOut(state),
		
		onSignOut(state),
		onSignIn(state)
	)
	
}

const onSignOut = (state) => ({
	onSignOut : () => {
//		state.signInBtn.show();
//		state.signOutBtn.hide();
	}
});

const onSignIn = (state) => ({
	onSignIn : () => {
		console.log('signed in!');
//		state.signOutBtn.show();
//		state.signInBtn.hide();
		if(state.notRendered){
//			  state.notRendered = false;
//				state.self.loadItems();
		}							
	}
});

const loadItems = (state) => ({
	loadItems: () =>{
			sta
	}
})

	
$(document).ready(function(){
	  
    window.WebLinker = CatLinks();	  
    WebLinker.init(WebLinker);
});	






