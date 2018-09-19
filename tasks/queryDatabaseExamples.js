import mongodb from 'mongodb';

export async function countRecords(){

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "songs";
    
    await async function() {
        let client;
      
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected correctly to server");
      
             const db = client.db(dbName);

            const col = db.collection(collection);
      
            const docs = await col.find({Artist: /.*/}).toArray();

            console.log("There are " + docs.length + " records returned");
        } catch (err) {
             console.log(err.stack);
        }
      
        client.close();
      }();


}

export async function findbyTitle(search){

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "songs";
    
    await async function() {
        let client;
      
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected correctly to server");
      
             const db = client.db(dbName);

            const col = db.collection(collection);
      
            const docs = await col.find({Title: {$regex: search, $options: 'i'} }).toArray();

            console.log("There are " + docs.length + " records returned");
            console.log(docs);
        } catch (err) {
             console.log(err.stack);
        }
      
        client.close();
    }();
}

export async function findbyArtist(search){

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "songs";
    
    await async function() {
        let client;
      
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected correctly to server");
      
             const db = client.db(dbName);

            const col = db.collection(collection);
      
            const docs = await col.find({Artist: {$regex: search, $options: 'i'} }).toArray();

            console.log("There are " + docs.length + " records returned");
            console.log(docs);
        } catch (err) {
             console.log(err.stack);
        }
      
        client.close();
    }();
}

export async function find(search){

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "songs";
    
    await async function() {
        let client;
      
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected correctly to server");
      
             const db = client.db(dbName);

            const col = db.collection(collection);
      
            const docs = await col.find( { $or: [ 
                { Title: {$regex: search, $options: 'i'} },
                { Artist: {$regex: search, $options: 'i'} } 
                ] } ).toArray();

            console.log("There are " + docs.length + " records returned");
            console.log(docs);
        } catch (err) {
             console.log(err.stack);
        }
      
        client.close();
    }();
}


export async function artistStartsWith(search){

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "songs";
    
    await async function() {
        let client;
      
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected correctly to server");
      
             const db = client.db(dbName);

            const col = db.collection(collection);
      
            const docs = await col.find( {Artist: {$regex: '^' + search + '.*', $options: 'i'} } ).toArray();

            console.log("There are " + docs.length + " records returned");
            console.log(docs);
        } catch (err) {
             console.log(err.stack);
        }
      
        client.close();
      }();
}

export async function titleStartsWith(search){

    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "songs";
    
    await async function() {
        let client;
      
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected correctly to server");
      
             const db = client.db(dbName);

            const col = db.collection(collection);
      
            const docs = await col.find( {Title: {$regex: '^' + search + '.*', $options: 'i'} } ).toArray();

            console.log("There are " + docs.length + " records returned");
            console.log(docs);
        } catch (err) {
             console.log(err.stack);
        }
      
        client.close();
      }();
}
