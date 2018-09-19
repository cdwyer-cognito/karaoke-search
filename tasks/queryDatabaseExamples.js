import mongodb from 'mongodb';

async function runQuery(jsonObj){
    const MongoClient = mongodb.MongoClient;
	const url = "mongodb://localhost:27017/karaokeSearch";
	const dbName = "karaoke";
    const collection = "songs";
    let results;

    await async function() {
        let client;
      
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            console.log("Connected correctly to server");
      
            const db = client.db(dbName);

            const col = db.collection(collection);
      
            results = await col.find( jsonObj ).toArray();

            console.log("There are " + results.length + " records returned");
        } catch (err) {
             console.log(err.stack);
        }
      
        client.close();
      }();

    return results;
}

function regexEscape( string ){
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function countRecords(){
    return await runQuery( { Title: /.*/ } );
}

export async function findbyTitle(search){
    return await runQuery( {Title: {$regex:  regexEscape(search), $options: 'i'} } ); 
}

export async function findbyArtist(search){
    return await runQuery( {Artist: {$regex:  regexEscape(search), $options: 'i'} } ); 
}

export async function find(search){
    search =  regexEscape(search);
    return await runQuery( { $or: [ 
        { Title: {$regex: search, $options: 'i'} },
        { Artist: {$regex: search, $options: 'i'} } 
        ] 
    });
}

export async function artistStartsWith(search){
    return await runQuery( {Artist: {$regex: '^' +  regexEscape(search) + '.*', $options: 'i'} } );
}

export async function titleStartsWith(search){
    return await runQuery( {Title: {$regex: '^' +  regexEscape(search) + '.*', $options: 'i'} } );
}
