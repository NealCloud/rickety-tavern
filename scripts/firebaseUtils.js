var fireStuff = {};

(function(fireUtil){
	
	const main = {
		
		 initFirebase : (state) => ({
			initFirebase : () =>{			
				// Shortcuts to Firebase SDK features.
				state.auth = firebase.auth();
				state.database = firebase.database();
				state.storage = firebase.storage();
				//create refs to the categories/tags      
				state.categories = firebase.database().ref("Categories");
				state.tagsRef = firebase.database().ref("Tags");  
				// Initiates Firebase auth and listen to auth state changes.
				//this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));  
				state.auth.onAuthStateChanged( (user) => state.self.onAuthStateChanged(user,  state.self.onSignIn, state.self.onSignOut));
			}
		}),

		 onAuthStateChanged : (state) => ({
			 onAuthStateChanged : (user, callin, callout) => {			
					console.log("Auth has changed!", user);
					if(user){
						callin();					
					}					
					else{
						callout();							
					}
			 }
			}),

	//sign into firebase
	 signIn : (state) => ({
		// Sign in Firebase using popup auth and Google as the identity provider.
		signIn : (authType, loginCallback) => { 
			
			var provider = null;
			console.log(authType, loginCallback);
			switch(authType){
				case "facebook": provider = new firebase.auth.FacebookAuthProvider();
			 	break;
				case "google": 
				default: provider = new firebase.auth.GoogleAuthProvider();
					provider.addScope('profile');
			} 			 

			state.auth.signInWithPopup(provider)
			.catch(function(e){
					loginCallback(e);
			});
			
		 }
	}),

		//signout firebase function
	 signOut : (state) => ({
		 
			signOut : () => {state.auth.signOut()}
		 
		})
		
}
	Object.assign(
						fireUtil,
						main						 
							 
							 )
	
	
	
})(fireStuff)
