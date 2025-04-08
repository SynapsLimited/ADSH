// server/index.js

const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const fileUpload = require('express-fileupload');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://adsh-client.vercel.app",
      "https://www.adsh2014.al",
      "https://adsh2014.al",
    ],
    credentials: true,
  })
);

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
