import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
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

      // Hash the password using sha1 library
      const hashedPassword = sha1(password);

      const newUser = await dbClient.save('users', { email, password: hashedPassword });

      const responseUser = {
        id: newUser.ops[0]._id,
        email: newUser.ops[0].email,
      };

      return res.status(201).json(responseUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
