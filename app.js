const
express                 = require("express"),
mongoose                = require("mongoose"),
ejs                     = require("ejs"),
lodash                  = require("lodash");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
}
main().catch(err => console.log(err));

// Create article database
const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String
});

const Article = mongoose.model("Article", articleSchema);

//Home route
app.get("/", (req, res) => {
    Article.find({}, (err, foundArticles) => {
        if(!err) {
            res.render("home", {
                articles: foundArticles
            });
        } else {
            console.log(err);
        }
    });
});

// Single article
app.get("/articles/:articleId", (req, res) => {
    const requestedArticleId = req.params.ArticleId;
    Article.findById(requestedArticleId, (err, foundArticle) => {
        if(!err) {
            res.render("article", {
                title: foundArticle.title,
                content: foundArticle.content
            });
        } else {
            article = {title: "Not Found", content: ""};
            res.render("article", {
                title: article.title,
                content: article.content
            });
        }
    });
})

// Create post
app.post("/", (req, res) => {
    const compostArticle = {
        title: req.body.composeTitle,
        text: req.body.composeText
    };
    Article.create(compostArticle, (err, article) => {
        if (err) return handleError(err);
    }) 
    res.redirect("/");
})

app.listen(process.env.PORT||3000, function(){
    console.log("Server started on port 3000");
})
