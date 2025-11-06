import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://pauliselenius_db_user:6fzBqgyI6kDJAEL2@boatlycluster0.0urfnpz.mongodb.net/?appName=BoatlyCluster0';

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully to MongoDB!');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testConnection();