import sha1Hash from '../utils/sha1';
import dbClient from '../utils/db';

class UsersController {
  static async createUser(req, res) {
    const { email, password } = req.body;

    try {
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      const emailExists = await dbClient.findOne('users', { email });
      if (emailExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = sha1Hash(password);
      const user = await dbClient.save('users', { email, password: hashedPassword });

      const responseUser = {
        id: user.ops[0]._id,
        email: user.ops[0].email,
      };

      return res.status(201).json(responseUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
