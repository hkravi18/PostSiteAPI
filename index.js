const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require ('mongoose');
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())



mongoose.connect('mongodb+srv://hkravi2002:lhDSn8CY3DySSMSC@cluster0.eo4af96.mongodb.net/Postdb');
const PostSchema = new mongoose.Schema({ 
    id: String, 
    title: String,
    datetime: String,
    body: String
});
const Post = mongoose.model('Post', PostSchema);



const whitelist = ["https://postsitereactjs.onrender.com"];
const corsOption = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOption));



app.route("/posts")
.get(async(req, res) => {
    const data = await Post.find({});
    //console.log("data", data);
    res.send(data);
})

app.route("/posts")
.post(async(req, res) => {
    const newPost = new Post(req.body);
    await newPost.save();
    res.send(newPost);
})

app.route("/posts/:id")
.put(async(req, res) => {
    const id = req.params.id;
    const updatePost = req.body;
    await Post.findOneAndReplace({ id : id}, updatePost);
    res.send(updatePost);
})
.delete(async(req, res) => {
    const id = req.params.id;
    await Post.deleteOne({ id : id });
    res.send();
})


const port = process.env.PORT || 3500;
app.listen(port, (req,res) => {
    console.log('server is running on port ' + port);
})
