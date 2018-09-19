import mongodb from 'mongodb';
import assert from 'assert';

export async function addRequest( jsonObj ) {

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "requests";

    function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
    

    await async function() {
		let client;
	  
		try {

			client = await MongoClient.connect(url, { useNewUrlParser: true });
		  	console.log("Connected correctly to server");
		    
		  	const db = client.db(dbName);
		
		  	let r = await db.collection(collection).insertOne({
                GUID: guid(),
                Singer: jsonObj.Singer,
                DiscRef: jsonObj.DiscRef,
                Artist: jsonObj.Artist,
                Title: jsonObj.Title,
                DateTime: new Date(),
                State: false
              });

			assert.equal(1, r.insertedCount);
			console.log("Data added to " + collection + " collection");  
				
		} catch (err) {
              console.log(err.stack);
              return "Failed";
		}
	  
		if (client) {
		  	client.close();
        }
        return "Success";
	}();
}

export async function getRequests(){

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "requests";
    let results;
    
    await async function() {
        let client;
      
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected correctly to server");
      
             const db = client.db(dbName);

            const col = db.collection(collection);
      
            results = await col.find({Singer: /.*/}).toArray();

            console.log("There are " + results.length + " records returned");
        } catch (err) {
             console.log(err.stack);
        }
      
        client.close();
      }();

    return results;

}

export async function requestCompleted(jsonObj){

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "requests";

    await async function() {
        let client;
      
        try {
          client = await MongoClient.connect(url,  { useNewUrlParser: true });
          console.log("Connected correctly to server");
      
          const db = client.db(dbName);
          const col = db.collection(collection);

          let r = await col.updateOne( { GUID: jsonObj.GUID },  {$set: {State: true}});
          assert.equal(1, r.matchedCount);
          assert.equal(1, r.modifiedCount);

          console.log("Request for " + jsonObj.Singer + " is complete");
                
        } catch (err) {
          console.log(err.stack);
        }
      
        client.close();
      }();


}