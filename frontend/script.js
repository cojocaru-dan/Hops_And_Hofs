const buttonComponent = (id, text) => `<button id="${id}">${text}</button>`;

const beerTypeComponent = list => list.map(tag => `<li>${tag}</li>`);

const beerComponent = ({brewery, name, type, score, abv}) => `
	<div class="beer">
		<h2>${name}</h2>
		<h3>${brewery}</h3>
		<ul>${beerTypeComponent(type)}</ul>
		<h4>${score}</h4>
		<h5>${abv}</h5>
	</div>
`;

const winnerComponent = (beer) => `
	<div id="winner">
		<h1>The best light Ale is</h1>
		${beerComponent(beer)}
		${buttonComponent("closeWinner", "Close")}
	</div>
`;

const loadEvent = _ => {
	// the HTML elements with ID are available as global variables with the ID (eg. root) but it is better if you 
	const rootElement = document.getElementById("root");

	//You can add the HTML code to the DOM like this
	rootElement.insertAdjacentHTML("afterbegin", buttonComponent());

	const clickEvent = event => {
		console.dir(event.target);
		console.dir(event.target.id);
	}
	window.addEventListener("click", clickEvent);
}

// you can run your code in different ways but this is the safest. This way you can make sure that all the content (including css, fonts) is loaded.
window.addEventListener("load", loadEvent);