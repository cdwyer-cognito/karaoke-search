import gulp from 'gulp';
import {loadXML} from './tasks/loadXML';
import {countRecords, findbyArtist, findbyTitle, find, artistStartsWith, titleStartsWith} from './tasks/queryDatabaseExamples';


gulp.task('test', function(){
	console.log("Hello World");
});

gulp.task("loadXML", async function(){
	await loadXML('./test-xml/database.xml');
});

gulp.task("countRecords", async function(){
	await countRecords();
});

gulp.task("findbyArtist", async function(){
	await findbyArtist("Abba");
});

gulp.task("findbyTitle", async function(){
	await findbyTitle("africa");
});

gulp.task("find", async function(){
	await find("summer");
});

gulp.task("artistStartsWith", async function(){
	await artistStartsWith("a");
});

gulp.task("titleStartsWith", async function(){
	await titleStartsWith("i");
});