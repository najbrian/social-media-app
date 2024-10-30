const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// routes
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const postsRouter = require('./controllers/posts');
const chatRouter = require('./controllers/chat');
const messageRouter = require('./controllers/message');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors());
app.use(express.json());

// Routes go here
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/posts', postsRouter);
app.use('/chat', chatRouter);
app.use('/message', messageRouter);

app.listen(3000, () => {
    console.log('The express app is ready!');
});