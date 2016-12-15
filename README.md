# rickety-tavern

a link gathering site

testing Factory Generation and composition over Class object creation.
I found I needed an init that references itself to allow composition function access themeselves, maybe this is bad programming. No longer use this keyword but still needs
the self references
```javascript
const FactoryFunction = () =>{

  var privateProperty1 = true;
	function init(self){
		state.self = self;
	}; 
	
	state = {
		stateProperty1 : privateProperty1,
		stateProperty2 : false
	}	
	
	return Object.assign(
		{
			publicProperty1: true,
		  self : state.self		
		},
		compositionFunc1(state),
		compositionFunc2(state),
		ect..);
}
```
Composition functions allow resuse 
```javascript
	const compositionFunc1 = (state) => ({
		compositionFuncName : (param1) =>{
			if(state.publicProperty1)console.log(param1);
		}
	})
```
Initialize without the new keyword no prototypes
```javascript
	var newObj = FactoryFunction();
	newObj.init(newObj);
  newObj.compositionFuncName("Log This!");
```
Mostly to reuse Firebase commands throughout the site.


[my portfolio](nealcloud.com)