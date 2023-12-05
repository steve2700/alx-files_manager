import { MongoClient } from 'mongodb';

class DBSClient {
  constructor() {
    if (process.env.DB_HOST) {
      this.host = process.env.DB_HOST;
    } else {
      this.host = 'localhost';
    }
    if (process.env.DB_PORT) {
      this.port = process.env.DB_PORT;
    } else {
      this.port = 27017;
    }
    if (process.env.DB_DATABASE) {
      this.database = process.env.DB_DATABASE;
    } else {
      this.database = 'files_manager';
    }
    this.url = this.database + '//' + this.host + ':' + this.port;
    this.client = new MongoClient(url);
  }
}
