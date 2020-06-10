//jshint esversion:6

//Complete API using MEN

//Call the packages
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

/*
    Requests Targetting  all articles
*/

app.route('/articles')
    //get method => fetches all the articles
    .get((req, res) => {

        //find the articles
        Article.find((err, foundArticles) => {

            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {

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
    })

    .delete((req, res) => {

        //delete all the articles
        Article.deleteMany((err) => {
            if (!err) {
                res.send('Succesfully delete all the articles');
            } else {
                res.send(err);
            }
        });
    });

/*
    Requests Targetting  a specific articles
*/

app.route('/articles/:articleTitle')

    //get a specific article
    .get((req, res) => {

        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send('No article was found');
            }
        });
    })

    //update a specific article
    // => replace the entire document
    .put((req, res) => {

        Article.update({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, {
            overwrite: true
        }, (err) => {

            if (!err) {
                res.send('Succesfully update the article');
            }
        });
    })

    //update a specific article
    // => only replace a specific field
    .patch((req, res) => {

        Article.update({
            title: req.params.articleTitle
        }, {
            //pick out the field that already provided
            $set: req.body
        }, (err) => {

            if (!err) {
                res.send('Successfully updated article');
            } else {
                res.send(err);
            }
        });
    })

    //delete a specific article
    .delete((req, res) => {

        Article.deleteOne({
            title: req.params.articleTitle
        }, (err) => {
            if (!err) {
                res.send('Successfully deleted the corresponding article');
            } else {
                res.send(err);
            }
        });
    });

//listen to port 3000
app.listen(3000, () => {
    console.log("Server started on port 3000");
});