//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//connect to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//create article schema
const articleSchema = {
    title: String,
    content: String
};

//create article model
const Article = mongoose.model("Article", articleSchema);

//get method => fetches all the articles
app.get('/articles', (req, res) => {

    //find the articles
    Article.find((err, foundArticles) => {

        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});

//creates one onew article
app.post('/articles', (req, res) => {

    //cretae the article
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    //save the article
    newArticle.save((err) => {

        if (!err) {
            res.send('Successfully added a new article.');
        } else {
            res.send(err);
        }
    });
});

//listen to port 3000
app.listen(3000, () => {
    console.log("Server started on port 3000");
});