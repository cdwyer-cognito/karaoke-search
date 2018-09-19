import mongodb from 'mongodb';

export async function clearRequestsCollection() {

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "requests";

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

}