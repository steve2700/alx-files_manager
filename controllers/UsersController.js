const sha1 = require('sha1');
const { ObjectID } = require('mongodb');
const Queue = require('bull');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  static async postNew(request, response) {
    try {
      const { email, password } = request.body;

      if (!email) {
        return response.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return response.status(400).json({ error: 'Missing password' });
      }

      const users = dbClient.db.collection('users');
      const existingUser = await users.findOne({ email });

      if (existingUser) {
        return response.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = sha1(password);
      const result = await users.insertOne({
        email,
        password: hashedPassword,
      });

      const { insertedId } = result;
      response.status(201).json({ id: insertedId, email });
      userQueue.add({ userId: insertedId });
    } catch (error) {
      console.error('Error creating user:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }

    // Add a consistent return statement to pass ESlint error
    return null;
  }

  static async getMe(request, response) {
    try {
      const token = request.header('X-Token');
      const key = `auth_${token}`;
      const userId = await redisClient.get(key);

      if (!userId) {
        console.log('Hupatikani!');
        return response.status(401).json({ error: 'Unauthorized' });
      }

      const users = dbClient.db.collection('users');
      const idObject = new ObjectID(userId);
      const user = await users.findOne({ _id: idObject });

      if (!user) {
        return response.status(401).json({ error: 'Unauthorized' });
      }

      response.status(200).json({ id: userId, email: user.email });
    } catch (error) {
      console.error('Error fetching user details:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }

    // Add a consistent return statement to pass ESlint error
    return null;
  }
}

module.exports = UsersController;
