// server.js
 require('dotenv').config()

 console.log(process.env)



const express = require('express');
const mongoose = require('mongoose');
const User = require('./User');



const app = express();
const port = process.env.PORT || 8080;


mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));


app.use(express.json());


app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/users', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.findByIdAndRemove(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
