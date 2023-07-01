const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

require("dotenv").config()
console.log(process.env.CORS)

const User = require('./models/User');
const Post = require('./models/Post');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express();
const fs = require('fs');

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({ credentials: true, origin: process.env.CORS }));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://shivansharora973:xghBI1H8WRQwvzts@cluster0.2lzhv10.mongodb.net');

app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})


app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    // jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
    //   if (err) throw err;
    //   res.cookie('token', token).json({
    //     id: userDoc._id,
    //     username,
    //   });
    // });
    try {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          throw err;
        }
        res.cookie('token', token).json({
          id: userDoc._id,
          username,
        });
      });
    } catch (err) {
      console.error('Error signing JWT:', err);
      res.status(500).json({ error: 'Internal server error' });
    }

  } else {
    res.status(400).json('wrong credentials');
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

// app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
//   const { originalname, path } = req.file;
//   const parts = originalname.split('.');
//   const ext = parts[parts.length - 1];
//   const newPath = path + '.' + ext;
//   fs.renameSync(path, newPath);

//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;
//     const { title, summary, content } = req.body;
//     const postDoc = await Post.create({
//       title,
//       summary,
//       content,
//       cover: newPath,
//       author: info.id,
//     });
//     res.json(postDoc);
//   });
// });


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    try {
      const info = jwt.verify(token, secret, {});
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    } catch (err) {
      console.error('Error verifying JWT:', err);
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    console.error('Error handling file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath || postDoc.cover;
    await postDoc.save();

    res.json(postDoc);
  });
});

app.delete('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const postDel = await Post.findByIdAndDelete(postId);
    if (!postDel) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000);