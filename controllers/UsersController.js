import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async createUser(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in DB
    const existingUser = await dbClient.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create the new user in the database
    const newUser = await dbClient.createUser({ email, password: hashedPassword });

    // Return the new user with only the email and id
    const responseUser = { email: newUser.email, id: newUser._id };
    
    return res.status(201).json(responseUser);
  }
}

export default UsersController;
