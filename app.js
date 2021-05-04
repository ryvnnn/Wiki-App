const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = new mongoose.model('Article', articleSchema);

app.route('/articles')

// RESTful get request - find all 
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if (!err){
        res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

// RESTful post request - post all 
.post(function(req,res){
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content 
    });
    newArticle.save(function(err){
        if (!err){
            res.send('successfully added article');
        } else {
            res.send(err);
        }
    });
})

// RESTful delete request - delete all articles
.delete(function(req,res){
    Article.deleteMany(function(err){
        if (err){
            res.send(err);
        } else {
            res.send('successfully deleted all articles');
        }
    });
});


app.route('/articles/:articleName')

.get(function(req,res){
    Article.findOne({title: req.params.articleName}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else {
            res.send('no articles were found');
        }
    })
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleName}, 
        {title: req.body.title, 
        content: req.body.content},
        {overwite: true},
        function(err, foundArticle){
            if (!err){
                res.send('updated');
            } else {
                res.send('not updated');
            }
        });
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleName},
        {$set: req.body},
        function(err){
            if (!err){
                res.send('successfully single article');
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne({title:req.params.articleName}, function(err){
        if (!err){
            res.send('successfully deleted ' + req.params.articleName);
        } else {
            res.send(err);
        }
    })
});






app.listen(3000, function(){
    console.log('Server started');
});