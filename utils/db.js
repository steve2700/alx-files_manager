const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.mongoUri = `mongodb://${this.host}:${this.port}`;

    this.client = new MongoClient(this.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.connected = false;
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.connected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

  isAlive() {
    return this.connected;
  }

  async getCount(collectionName) {
    const db = this.client.db(this.database);
    const collection = db.collection(collectionName);
    const documentCount = await collection.countDocuments();
    return documentCount;
  }

  async nbUsers() {
    return this.getCount('users');
  }

  async nbFiles() {
    return this.getCount('files');
  }
}

module.exports = new DBClient();
