# rickety-tavern

a link gathering site

testing Factory Generation and composition over Class object creation.
```javascript
const FactoryFunction = () =>{

  var privateProperty1 = true;
	function privateFunction(){}; 
	
	state = {
		publicProperty1 : privateProperty1,
		publicProperty2 : false
	}	
	
	return Object.assign({}, compositionFunc1(state), compositionFunc2(state), ect..);
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
	var obj = FactoryFunction();	  
  obj.compositionFuncName("Log Me");
```
Mostly to reuse Firebase commands throughout the site.

[my portfolio](nealcloud.com)