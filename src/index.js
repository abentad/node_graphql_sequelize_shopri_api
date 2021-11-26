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

server.express.use('/profile', express.static(path.join(__dirname, `images/profile/`)));


// db.sequelize.sync().then(()=> {
server.start(() => console.log('Server is running on http://localhost:4000'));
// });


// {"query":"mutation ($file: Upload!) {\n  updateUser(data: {\n    username: \"Nathan\"\n  }, file: $file){\n    id\n    username\n    profile_image\n  }\n}", "variables": { "file": null } }
// {"query":"mutation ($file: Upload!) {\n  createUser(data: {\n    deviceToken: \"\",\n    username: \"Nathan\",\n    email: \"nathan@gmail.com\",\n    phoneNumber: \"934171620\",\n    password: \"12345678\",\n    dateJoined: \"2022/12/11\"    \n  }, file: $file){\n    token\n    user{\n      id\n      username\n      email\n      profile_image\n    }\n  }\n}", "variables": { "file": null } }