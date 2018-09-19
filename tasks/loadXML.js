import fs from 'fs';
import xml2json from 'xml2json';
import mongodb from 'mongodb';
import assert from 'assert';

export async function loadXML(filepath){

	let songFilepath = "";
	let songArtistTag = "";
	let songArtist = "";
	let songTitle = "";
	let songDiscRef = "";
	let songLength = "";
	let songKey = "";
	let extractArtist;
	let extractTitle;
	let karaokeCounter = 0;
	let songCounter = 0;
	let songsArray = [];
	let addRecord;


	const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
	const collection = "songs";
			
	const doc = fs.readFileSync(filepath).toString();
	console.log("Cleaning XML file");
	const cleanXMLString = doc.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, "");
	
	console.log("Creating Json Object from file");
	const jsonObj = xml2json.toJson(cleanXMLString, {object: true});

	console.log("Extracting data from Object");

	for (let song of jsonObj["VirtualDJ_Database"]["Song"]) {
		
		if (song.Flag === "96" ) {
			karaokeCounter ++;
			extractArtist = false;
			extractTitle = false;
			songFilepath = song.FilePath;
			addRecord = true;
			
			if ( song.Tags ) {
				if ( song.Tags.Author ) {
					songArtistTag = song.Tags.Author;
					songArtist = songArtistTag.substring(songArtistTag.indexOf(" "), songArtistTag.length).trim();
					songDiscRef =  songArtistTag.substring(0, songArtistTag.indexOf(" ") ).trim();
				} else {
					extractArtist = true;
					songArtist = "";
				}

				if ( song.Tags.Title ) {
					songTitle = song.Tags.Title.trim();	
				} else {
					extractTitle = true;
					songTitle = "";
				}
			} 

			// No tag available attempt to get information from filename.
			if ( extractArtist || extractTitle ){
				try {
					songFilepath = song.FilePath.split("\\").pop();
					const filenameArray = songFilepath.split(" - ");
					if ( extractArtist ) {
						songArtist = filenameArray[1];
						songDiscRef = filenameArray[0];
					}

					if ( extractTitle ) {
						let ext = filenameArray[2].split(".").pop();
						songTitle = filenameArray[2].replace("." + ext, "");
					}
				} catch (err) {
					addRecord = false;
					console.log("Error calculating song data from filename " + songFilepath);
					console.log(err.stack);
				}
			}

			if ( addRecord ) {
				songCounter++;
				songLength = "";
				if ( song.Infos ) {
					if ( song.Infos.SongLength ) {
						songLength = song.Infos.SongLength;
					} 
				} 
				
				songKey = "";
				if ( song.Scan ) {
					if ( song.Scan.Key ) {
						songKey = song.Scan.Key;
					}
				}

				songsArray.push({
					Filepath: songFilepath,
					DiscRef: songDiscRef,
					Title: songTitle,
					Artist: songArtist,
					Key: songKey,
					Length: songLength
				})
			}
		}
	} 

	console.log(karaokeCounter + " Karaoke Songs out of " + songCounter + " Songs in xml document");

	console.log("Dropping " + collection + " collection in " + dbName);

	await async function(){
		let client;
	  
		try {
		  	client = await MongoClient.connect(url, { useNewUrlParser: true });
		  	console.log("Connected correctly to server");
		    
		  	const db = client.db(dbName);
		
			let r = await db.collection(collection).drop();
			console.log(collection + " collection dropped");
		
		} catch (err) {
		  	console.log(err.stack);
		}
	  
		if (client) {
		 	client.close();
		}
	}();

	console.log("Inserting data into " + collection + " collection in " + dbName + " database");

	await async function() {
		let client;
	  
		try {

			client = await MongoClient.connect(url, { useNewUrlParser: true });
		  	console.log("Connected correctly to server");
		    
		  	const db = client.db(dbName);
		
		  	let r = await db.collection(collection).insertMany(songsArray);
			assert.equal(songsArray.length, r.insertedCount);
			console.log("Data added to " + collection + " collection");  
				
		} catch (err) {
		  	console.log(err.stack);
		}
	  
		if (client) {
		  	client.close();
		}
	}();

	console.log("Task completed");
	
}