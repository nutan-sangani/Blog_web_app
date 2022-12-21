const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require('mongoose');
var lodash= require("lodash");
//we are going to make this a persistive website using a database.
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/postDB');

const posts=[];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){ //renders 2nd param is a js object, thus multiple
  //key value pairs may be given to it.
    //res.render("home",{title:"HOME",content:homeStartingContent, posts:posts});
    //this renders the home page and sends the posts array to ejs to display.

    //to use mongodb, we will find all content of db, which will return an array, we wil send this to ejs
    Post.find({},function(err,found_item){
        res.render("home",{title:"HOME",content:homeStartingContent, posts:found_item});
    })
  });

app.get("/about",function(req,res){
  res.render("about",{title:"ABOUT",content:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{title:"CONTACT",content:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose",{title:"COMPOSE"});
});

//when user clicks readmore, he is redirected here.
//change it to find the contents from the db.
//finding by name is cumbersome, we can very easily find by id.
app.post("/posts/:topic",function(req,res){
  const r=lodash.lowerCase(req.params.topic);
  const id=req.body.id;
  Post.findById(id,function(err,found_post){
        if(err) console.log(err);
        res.render('post',{Title:found_post.Title,Content:found_post.Content});
        //console.log(found_post.Content);
    });
  
  //console.log(r);

  // console.log(r);
  // console.log(posts);
//   let flag=1;
//   for(var i=0;i<posts.length;i++){
//     if(posts[i].Title===r){
//       res.render("post", {Title:posts[i].Title, Content:posts[i].Content})
//       flag=0;

//     }
//   }
//   if(flag===1){
//     console.log("ERROR 404, page not found");
//   }


    


    // console.log(r);
    // res.redirect('/');
})

//change here so that when they post, it stores it to db it creates the db.
const postschema=new mongoose.Schema({
    Title:String,
    Content:String
});
const Post=new mongoose.model('post',postschema);


app.post("/compose",function(req,res){
//   const post={
//     Title:lodash.lowerCase(req.body.newTitle),
//     Content:req.body.postContent
//   };
    const post1=new Post({Title:req.body.newTitle,
    Content:req.body.postContent});
    post1.save();
//thus we successfully saved it, now we need to redirect to root route
//but before we need to display content in our db on root route.

//   posts.push(post);
   res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
