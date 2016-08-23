# stagelink-react-vote-form

## Build
```
npm install
npm install browserify watchify -g
./build.sh
```

## Components
Below are presented important code parts of vote form.

### index.jsx
It's container component for all sub-components.


#### state
##### `voted` property
Depending on `this.state.voted` is displayed form or map with marker as vote.

`this.state.voted → false`

```
index.jsx
→ vote-header.jsx
→ vote-form.jsx
	→ input
	→ demand-select.jsx
	→ buttons (facebook-handler.js, google-handler.jsx, instagram-handler.jsx)
→ vote-footer.jsx

```

or `this.state.voted → true`

```
index.jsx
→ vote-map.jsx
```

##### `artist` property
This value is based on global variable `artist` in index.html file. The `artist` variable has information about `name`, `id` and `vote-values`.

Example:
```html
<script>
const artist = {
	'name': 'Die Lochis',
	'id': 'die-lochis',
	'vote-values': {
		'euro':{
			prices: [10, 20, 30],
			currency_symbol: '€'
		},
		'pound':{
			prices: [30, 50],
			currency_symbol: '£'
		},
		'dollar':{
			prices: [45, 65, 75],
			currency_symbol: '$'
		}
	}
}
</script>
```

##### `coords` property
After voting the variable `this.state.voted` is assigned `true` value and then map is using `this.state.coords` for displaying correct marker and area.


#### Functions

##### `componentDidMount`
This function includes listeners `isVoted` and `changeCoords`.

##### `isVoted` listener
After voting this listener receives information about voting and in callback function changes `this.state.voted`.


##### `changeCoords` listener
As above but it changes `this.state.coords` and sets localStorage property `stagelink-coords`.


##### `componentWillMount`
In this case this function has 3 responsibilities:
- loading map again instead of form when global `artist.id` property is the same with `artist_id` saved in localStorage object,
- loading coords from localStorage
- handle response from Instagram and send request to backend, because Instagram doesn't have JavaScript API. In this place we need to get the `code` value from Instagram which is taken from the address bar as url param.


### vote-header.jsx
It's simple stateless component which displays `header` tag with artist name through `this.props`.

### vote-footer.jsx
As above.


### demand-select.jsx
This component displays `select` tags in form. The values are loading through `this.props`.

### vote-form.jsx

#### Important functions

##### `componentWillUnmount` and `storeStateBeforeRequest`
These functions have the same body but `componentWillUnmount` works when we are voting by Instagram. The `storeStateBeforeRequest` functions works in case voting by Facebook and Google.
It happens because instagram performs redirect. The responsibility of these features is saving currrent state to localStorage object.

##### `googleResponse` and `facebookResponse`
These functions are handlers for response from Facebook and Google. What is the Instagram, please check componentWillMount header in description about index.jsx.



## Modules

- event-emitter (for two-data binding in React)
- facebook-handler.js (it's implementation complies with Facebook documentation, because ready components from npm don't have possibility to totally styling.)
- google-handler.jsx (it's simple button React Component)
- instagram-handler.jsx (it's simple button React Component)
- params-handler (for loading value from url)
- request-wrapper (for requests)
