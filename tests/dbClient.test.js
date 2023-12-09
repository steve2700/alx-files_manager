const { expect } = require('chai');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const DBClient = require('../utils/db');

describe('DB Client Tests', () => {
  let clientStub;
  let dbStub;
  let dbClient;

  beforeEach(() => {
    dbStub = sinon.stub();
    clientStub = sinon.stub(MongoClient, 'connect').resolves({ db: dbStub });
    dbClient = new DBClient();
  });

  afterEach(() => {
    clientStub.restore();
  });

  it('should check if MongoDB is alive', () => {
    expect(dbClient.isAlive()).to.be.true;
  });

  it('should get the number of users', async () => {
    const usersCollectionStub = sinon.stub().resolves({ countDocuments: sinon.stub().resolves(5) });
    dbStub.withArgs('users').returns(usersCollectionStub);

    const result = await dbClient.nbUsers();
    expect(result).to.equal(5);
  });

  it('should get the number of files', async () => {
    const filesCollectionStub = sinon.stub().resolves({ countDocuments: sinon.stub().resolves(10) });
    dbStub.withArgs('files').returns(filesCollectionStub);

    const result = await dbClient.nbFiles();
    expect(result).to.equal(10);
  });

  // more tests could be added for other functions in DBClient
});
