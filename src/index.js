const { GraphQLServer } = require('graphql-yoga');
const path = require('path');
const express = require('express');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Product = require('./resolvers/Product');
const Upload = require('./resolvers/Upload');
const db = require('../models');



const server = new GraphQLServer({ 
    typeDefs:'src/schema.graphql',
    resolvers: { Upload, Query, Mutation, User, Product },
    context(req){ return { req, db }; } 
});

// server.express.use('/uploads/profile', server.express.static(path.join(__dirname, `/images/profile/`)));
server.express.use(express.static("images/profile"));
// server.express.get('/profile/*', (req, res, next) => {
//     // here you can use your way to get the path dir ..  
//     const pathDir = path.join(__dirname, `./images/profile`);
//     console.log(pathDir);
//     res.sendFile(pathDir);
// });

// db.sequelize.sync().then(()=> {
server.start(() => console.log('Server is running on http://localhost:4000'));
// });


