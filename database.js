// // Import the mongoose module
// const mongoose = require('mongoose');

// // Define a schema
// const Schema = mongoose.Schema;

// const authorSchema = new Schema({
//   name: String,
//   stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }],
// });

// const storySchema = new Schema({
//   author: { type: Schema.Types.ObjectId, ref: 'Author' },
//   title: String,
// });

// const Story = mongoose.model('Story', storySchema);
// const Author = mongoose.model('Author', authorSchema);

// // Compile model from schema
// const SomeModel = mongoose.model('SomeModel', schema);

// // Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// // Included because it removes prepartory warnings for Mongoose 7.
// // See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
// mongoose.set('strictQuery', false);

// // Define the databse URL to connect to:
// const mongoDB = 'mongodb:127.0.0.1/my_database';
// // Wait for databse to connect, logging an error if there is a problem
// main().catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(mongoDB);
// }

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://vinaygrp:xGcUM4rsBvy9k2n6@cluster0.oqen4av.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
