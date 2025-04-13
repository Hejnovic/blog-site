import express from "express";
import bodyParser from "body-parser";

function findPostById(postArr,postId){
    return postArr.find(obj => obj.id === postId);
}

function findPostIndexById(postArr,postId){
    return postArr.findIndex(obj => obj.id === postId);
}

const app = express();
const port = 3000;
const maxLength = 2048;
let savedPosts = [];
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get("/",(req,res) =>{
    res.render('index.ejs',{posts:savedPosts});
});

app.get("/new-post",(req,res) =>{
    res.render('newPost.ejs',{maxLength: maxLength});
});

app.get("/contact",(req,res) =>{
    res.render('contact.ejs');
});

app.get("/about",(req,res) =>{
    res.render('about.ejs');
});

app.post("/new-post",(req,res)=>{
    let newPost ={
        title: req.body['post-title'],
        content: req.body['post-content'],
        id: [],
        date: []
    }

    let currentDate = new Date();
    newPost.id = currentDate.getTime().toString();
    let day = currentDate.getDate();
    if(day < 10){
        day = `0${day}`;
    }
    let month = currentDate.getMonth();
    if(month< 10){
        month = `0${month}`;
    }
    let year = currentDate.getFullYear();
    newPost.date ="Created at "+ day + "." + month +"."+ year;
    if(newPost.title === ""){
        newPost.title = "Title";
    }
    savedPosts.push(newPost);
    res.redirect("/");
});

app.get('/post/:postId',(req,res)=>{
    let postId = req.params['postId'];
    let checkedPost = findPostById(savedPosts,postId);
        res.render("post.ejs",{title:checkedPost.title,content:checkedPost.content,postId:checkedPost.id,date:checkedPost.date});
    }
    );

app.post('/delete/:postId',(req,res)=>{ 
    let postId = req.params['postId'];
    if(postId){
        let postIndex = findPostIndexById(savedPosts,postId);
        if(postIndex !== -1){
            savedPosts.splice(postIndex,1);
        }
    }
    res.redirect("/");
})

app.get("/edit/:postId",(req,res)=>{
    let postId = req.params['postId'];
    let editedPost = findPostById(savedPosts,postId)
    res.render("edit.ejs",{title:editedPost.title,content:editedPost.content,postId:editedPost.id,maxLength:maxLength});
});

app.post("/edit/:postId",(req,res)=>{ 
    let postId = req.params['postId'];
    let editedPostIndex =  findPostIndexById(savedPosts,postId);
    savedPosts[editedPostIndex] = {
        title: req.body['post-title'],
        content: req.body['post-content'],
        id: postId,
        date: savedPosts[editedPostIndex].date
    }

    res.redirect("/");
});

app.listen(port,() =>{
    console.log(`Listening on port:${port}`);
});