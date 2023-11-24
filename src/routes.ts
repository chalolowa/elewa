import { Router } from 'express';
import checkFreeUserLimits from './middleware/regulator';
import axios from 'axios';
import { authenticateConfirm, secretKey } from './middleware/auth';
import jwt from 'jsonwebtoken';
import { users } from './models/mockData';

const route = Router();

route.get("/", checkFreeUserLimits, async (req, res) => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      const posts = response.data.slice(0, 20);
      res.render('feed', { posts });
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      res.status(500).send('Internal Server Error');
    }
});

// Login Page
route.get('/login', (req, res) => {
    res.render('login');
});
  
route.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Please enter all fields');
    }
    // Mock authentication
    if (users[username] && users[username].password === password) {
        const token = jwt.sign({ username, isPremium: users[username].isPremium }, secretKey);
        res.cookie('token', token);
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// Profile Page
route.get('/profile', authenticateConfirm, (req, res) => {
    const fetchUserProfile = async (username) => {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users?username=${username}`);
        return response.data;
    };
    res.render('profile', { fetchUserProfile });
});
  
// My Posts Page
route.get('/my-posts', authenticateConfirm, (req, res) => {
    const userId = req.user.id;
    axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`).then((response) => {
      const myPosts = response.data;
      res.render('myPosts', { myPosts });
    }).catch((error) => {
      console.error('Error fetching posts:', error.message);
      res.status(500).send('Internal Server Error');
    });
});
  
// Following Page
route.get('/following', authenticateConfirm, (req, res) => {
    axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${[2, 3, 4].join('&userId=')}`).then((response) => {
      const followingPosts = response.data;
      res.render('following', { followingPosts });
    }).catch((error) => {
      console.error('Error fetching posts:', error.message);
      res.status(500).send('Internal Server Error');
    });
});

// Paywall Page
route.get('/paywall', authenticateConfirm, (req, res) => {
    res.render('paywall');
});

route.post('/pay', (req, res) => {
    const { username } = req.user;

    // Mock payment process
    users[username].isPremium = true;

    //Update token
    const token = jwt.sign({ username, isPremium: users[username].isPremium }, secretKey);
    res.cookie('token', token);
    res.redirect('/');
});

// Logout
route.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

export default route;
