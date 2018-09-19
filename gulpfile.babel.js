import gulp from 'gulp';
import {loadXML} from './tasks/loadXML';
import {countRecords, findbyArtist, findbyTitle, find, artistStartsWith, titleStartsWith} from './tasks/queryDatabaseExamples';
import {addRequest, getRequests, requestCompleted} from './tasks/requests';
import {clearRequestsCollection} from './tasks/clearRequestsCollection';


gulp.task('test', function(){
	console.log("Hello World");
	console.log( new Date() );
});

gulp.task("loadXML", async function(){
	await loadXML('./test-xml/database.xml');
});

gulp.task("countRecords", async function(){
	await countRecords();
});

gulp.task("findbyArtist", async function(){
	console.log( await findbyArtist("r.e.m") );
});

gulp.task("findbyTitle", async function(){
	console.log( await findbyTitle("Numb") );
});

gulp.task("find", async function(){
	console.log( await find("summer") );
});

gulp.task("artistStartsWith", async function(){
	console.log( await artistStartsWith("a") );
});

gulp.task("titleStartsWith", async function(){
	console.log( await titleStartsWith("Z") );
});

gulp.task("clearRequestsCollection", async function(){
	await clearRequestsCollection();
});

gulp.task("addRequest", async function(){
	let search = await findbyArtist("metallica");
	console.log(search);
	
	let chosenRequest = search.pop();

	console.log("Requesting form search results:");
	console.log(chosenRequest);
	
	console.log(await addRequest ({
		Singer: "Mark C",
		DiscRef: chosenRequest.DiscRef,
		Artist: chosenRequest.Artist,
		Title: chosenRequest.Title,
		Filepath: chosenRequest.Filepath,
	}) );
});

gulp.task("getRequests", async function() {
	let pending = [];
	let completed = [];
	
	for ( let request of await getRequests() ) {
		if ( request.State ) {
			completed.push(request);
		} else {
			pending.push(request);
		}
	}

	console.log("Pending Requests: ================================");
	console.log(pending);
	console.log("Comnpleted Requests: =============================");
	console.log(completed);

});

gulp.task("requestCompleted", async function(){
	let pending = [];
	let completed = [];
	
	for ( let request of await getRequests() ) {
		if ( request.State ) {
			completed.push(request);
		} else {
			pending.push(request);
		}
	}

	await requestCompleted(pending[0]);

	pending = [];
	completed = [];
	
	for ( let request of await getRequests() ) {
		if ( request.State ) {
			completed.push(request);
		} else {
			pending.push(request);
		}
	}

	console.log("Pending Requests: ================================");
	console.log(pending);
	console.log("Comnpleted Requests: =============================");
	console.log(completed);
});