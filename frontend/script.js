let toggleSort = false;
let actualDisplayedBeers;
let state;
const rootElement = document.getElementById("root");

const buttonComponent = (id, text) => `<button id="${id}">${text}</button>`;

const beerTypeComponent = list => list.map(tag => `<li>${tag}</li>`);

const beerComponent = ({brewery, name, type, score, abv}) => `
	<div class="beer">
		<h2>${name}</h2>
		<h3>${brewery}</h3>
		<ul>${beerTypeComponent(type).join("")}</ul>
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

const deleteAlreadyDisplayedBeers = () => {
	// remove beersList from HTML
	const beersListFromHTML = document.querySelectorAll("section");
	beersListFromHTML.forEach(beerFromHTML => beerFromHTML.remove());
}

const insertBeer = (beerObject) => {
	const beerSection = `<section>${beerComponent(beerObject)}</section>`;
	rootElement.insertAdjacentHTML("beforeend", beerSection);
};

const addEvent = (id) => {
	const HTML_element = document.querySelector(`#${id}`);
	HTML_element.addEventListener("click", () => {
		if (id === "loadBeers") {
			displayBeersFirstTime(HTML_element);
		} else if (id === "sortByScore") {
			displaySorted();
		} else if (id === "filterStrongIPAs") {
			displayFiltered(HTML_element);
		} else if (id === "resetFilter") {
			displayReseted(HTML_element);
		} else if (id === "bestLightAle") {
			displayBestLightAle(HTML_element);
		} else if (id = "closeWinner") {
			remmoveWinnerFromHTML();
		}
	})
}

const displayBeersFirstTime = (element) => {
	// insert beers in HTML
	beers.map(insertBeer);
	actualDisplayedBeers = [...beers];
	state = "unsorted";
	// delete button for render beers
	element.remove();
	// insert a button for sorting beers
	rootElement.insertAdjacentHTML("afterbegin", buttonComponent("sortByScore", "Sort by score"));
	addEvent("sortByScore");

	//insert a button for filter beers by Strong IPA
	rootElement.insertAdjacentHTML("afterbegin", buttonComponent("filterStrongIPAs", "Strong IPAs"));
	addEvent("filterStrongIPAs");

	//insert a button for selected best light ale beer
	rootElement.insertAdjacentHTML("afterbegin", buttonComponent("bestLightAle", "Best Light Ale"));
	addEvent("bestLightAle");
}

const displaySorted = () => {
	deleteAlreadyDisplayedBeers();

	// render beers sorted by score without affecting the original array
	toggleSort = toggleSort ? false : true;
	actualDisplayedBeers.sort((fBeer, sBeer) => {
		return toggleSort ? fBeer.score - sBeer.score : sBeer.score - fBeer.score;
	});
	state = toggleSort ? "ascending" : "descending";
	actualDisplayedBeers.forEach(insertBeer);
}

const displayFiltered = (element) => {
	deleteAlreadyDisplayedBeers();

	// modify actual displayed list
	actualDisplayedBeers = actualDisplayedBeers.filter(beer => beer.type.includes("IPA") && beer.abv >= 6);
	switch (state) {
		case "unsorted":
			break;
		case "ascending":
			actualDisplayedBeers.sort((first, second) => first.score - second.score);
			break;
		case "descending":
			actualDisplayedBeers.sort((first, second) => second.score - first.score);
			break;
	}
	actualDisplayedBeers.forEach(insertBeer);

	// remove filter button
	element.remove();
	// add Reset Filter button
	rootElement.insertAdjacentHTML("afterbegin", buttonComponent("resetFilter", "Reset filter"));
	addEvent("resetFilter");
}

const displayReseted = (element) => {
	deleteAlreadyDisplayedBeers();

	// add beersList back unfiltered
	actualDisplayedBeers = [...beers];
	switch (state) {
		case "unsorted":
			break;
		case "ascending":
			actualDisplayedBeers.sort((first, second) => first.score - second.score);
			break;
		case "descending":
			actualDisplayedBeers.sort((first, second) => second.score - first.score);
			break;
	}
	actualDisplayedBeers.forEach(insertBeer);

	// remove Reset Filter Button
	element.remove();

	// add button for filter back
	rootElement.insertAdjacentHTML("afterbegin", buttonComponent("filterStrongIPAs", "Strong IPAs"));
	addEvent("filterStrongIPAs");
}

const displayBestLightAle = (element) => {
	//find ale beer with abv <= 6 and highest score
	const bestLightAleBeer = beers.reduce((firstBeer, secondBeer) => {
		if (firstBeer.type.includes("Ale") && firstBeer.abv <= 6 && secondBeer.type.includes("Ale") && secondBeer.abv <= 6) {
			return firstBeer.score >= secondBeer.score ? firstBeer : secondBeer;
		} else if (firstBeer.type.includes("Ale") && firstBeer.abv <= 6) {
			return firstBeer;
		} else if (secondBeer.type.includes("Ale") && secondBeer.abv <= 6) {
			return secondBeer;
		} else {
			return {
				brewery: "",
				name: "",
				type: [],
				score: -Infinity,
				abv: -Infinity
			  };
		}
	});

	// insert beer in a section HTML element
	if (bestLightAleBeer.type.includes("Ale") && bestLightAleBeer.abv <= 6) {
		rootElement.insertAdjacentHTML("afterbegin", `<section id=winnerSection>${winnerComponent(bestLightAleBeer)}</section>`);
	}
	//remove button
	element.remove();
	// add click event for close button
	addEvent("closeWinner");
};

const remmoveWinnerFromHTML = () => {
	// remove winner from HTML
	document.querySelector("#winnerSection").remove();
	// insert again "Best Light Ale" button
	rootElement.insertAdjacentHTML("afterbegin", buttonComponent("bestLightAle", "Best Light Ale"));
	addEvent("bestLightAle");
}

const loadEvent = _ => {
	// the HTML elements with ID are available as global variables with the ID (eg. root) but it is better if you 
	const rootElement = document.getElementById("root");

	//You can add the HTML code to the DOM like this
	rootElement.insertAdjacentHTML("afterbegin", buttonComponent("loadBeers", "Load the beers"));
	addEvent("loadBeers");

	const clickEvent = event => {
		console.dir(event.target);
		console.dir(event.target.id);
	}
	window.addEventListener("click", clickEvent);
}

// you can run your code in different ways but this is the safest. This way you can make sure that all the content (including css, fonts) is loaded.
window.addEventListener("load", loadEvent);
