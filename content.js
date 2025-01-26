console.log("the script started!");

var elementsToTrack = [
	{
		element: "mybutton",
		events : ["click"]
    }
];

for (var i = 0; i < elementsToTrack.length; i++) {
	var e = elementsToTrack[i];
	new Interactor({
		interactionElement 	: e.element,
		interactionEvents 	: e.events
	});
} 