import express from 'express';
import router from './routes/index';

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use('/api', router); // Assuming your routes are under '/api'

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
