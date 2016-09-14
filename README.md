# stagelink-react-vote-form

## Build
```
npm install
npm install browserify watchify -g
./build.sh
```

## Clear build
```
localStorage.removeItem('stagelink-vote');
```

Removing `stagelink-coords` isn't requried.


## Components
Below are presented important code parts of vote form.

### index.jsx
It's container component for all sub-components.


#### state
##### `voted` property
Depending on `this.state.voted` is displayed form or map with marker as vote.

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
- handle response from Instagram and send request to backend, because Instagram doesn't has JavaScript API. In this place we need to get the `code` value from Instagram which is taken from the address bar as url param.


### vote-header.jsx
It's simple stateless component which displays `header` tag with artist name through `this.props`.

### footer.jsx
As above this component displays `footer` tag.


### select-demand.jsx
This component displays `select` tags in form. The values are loading through `this.props`.

### vote-form.jsx

#### Important properties in state
##### `authResponse` property
Here is stored the answer from logging services (Facebook, Google, Instagram).

##### `choiseFromSuggestions` property
It's value for checking whether the user has selected place from suggestions.

##### `emptyField` property
If input field has text then in `render` function simple `if else` statement grabs this value and when if is assigned `true` then it displays `input` with `tooltip` "Where should the show take place?" otherwise it displays list with suggestions.

##### `demand` property
This object has information about chosen currency and value.

UPDATE: This property isn't used in form, also `setState` isn't called for this property. After send request to backend information about `demans` is loading from refs, because we don't need this information in lifecycle of form and re-render through this value.


#### Important functions

##### `storeStateBeforeRequest`
Instagram performs redirect so we have to save localStorage. When we are voting by Facebook and Google, we have JavaScript SDK and opportunity to load information about logging to service through Promise, in case Instagram not.

##### `googleResponse` and `facebookResponse`
These functions are handlers for response from Facebook and Google. What is the Instagram? Please check componentWillMount header in description about index.jsx.


##### `loadLocations`
This function loads data from Autocompletion Service Google through Promise. It's used in `componentDidUpdate` function because the new locations are loading only when typing something in input.

##### `selectPlaceById`
When you are choosing a place, this function loads coordinates of place by `place_id`.


## Modules

- event-emitter (for two-data binding in React)
- facebook-handler.js (it's implementation complies with Facebook documentation, because ready components from npm don't have possibility to totally styling.)
- google-handler.jsx (it's simple button React Component)
- instagram-handler.jsx (it's simple button React Component)
- params-handler (for loading value from url)
- request-wrapper (for requests)
