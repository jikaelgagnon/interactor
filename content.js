console.log("the script started!");
// TODO: Come up with a general way to list elements to track and
// how to mark them. Currently, i think the easiest way is to add the interactor class
// to each of them.
// Current problem: listing every single element by id can become very cumbersome. Also,
// What about off chance that website already has an interactor class?
// Probably want a set to track all relevant elements.

const selectors_list = [
	"h1",
	"h2"
]

// var elementsToTrack = [
// 	{
// 		element: "mybutton",
// 		events : ["click"]
//     }
// ];

// for (var i = 0; i < elementsToTrack.length; i++) {
// 	var e = elementsToTrack[i];
// 	new Interactor({
// 		interactionElement 	: e.element,
// 		interactionEvents 	: e.events
// 	});
// } 

const i = new Interactor({
	cssSelectors : selectors_list,
})