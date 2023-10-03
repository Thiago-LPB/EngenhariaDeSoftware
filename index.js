import express from "express";


const app = express();
const port = 3000;
var loggedUser;
var login = 0;
let email;
let users = [];


function User(email, password, gamesOwned, gamesPosted, cart) {
    this.email = email;
    this.password = password;
    this.gamesOwned = gamesOwned;
    this.gamesPosted = gamesPosted;
    this.cart = cart;
    this.cartPrice = function(){
        let price = 0
        for(let cart of this.cart){
            price += parseInt(cart.price);
        }
        return price.toString();
    }
}

function Game(name, price, img){
    this.name = name;
    this.price = price;
    this.img = img;
}

function searchUsers(users, email) {
    for (let user of users) {
        if(user.email === email){
            return user;
        }
    }
    return "Usuario nao encontrado"
}
function searchGame(games, name){
    for(let game of games) {
        if(game.name == name){
            return game;
        }
    }
    return "not found";
}
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

var testeUser = new User("admin@test.com","admin",[],[],[]);
users.push(testeUser);

app.get("/", (req,res)=>{
    console.log(loggedUser);
    if(login===0){
        res.render("index.ejs");
    }else{
        
        res.render("login.ejs");
    }
    
});

app.post("/login", (req,res)=>{
    loggedUser = searchUsers(users,req.body["email"]);
    
    if(loggedUser.password === req.body["password"]){
        login = 1;
        console.log(loggedUser.password, req.body["password"])
        res.redirect("/");
    }else{
        res.redirect("/");
    }
    
});
app.post("/",(req, res) => {
    console.log(req.body)
    loggedUser.cart.push(new Game(req.body["name"],req.body["price"],req.body["img"]));
    res.redirect("/");
});
app.post("/logOut", (req,res)=>{
    login = 0;
    loggedUser = null;
    res.redirect("/");
});
app.post("/mygames",(req,res)=>{
    res.render("games.ejs", {User: loggedUser});
});
app.post("/cart",(req,res)=>{
    res.render("cart.ejs", {User:loggedUser,i:0});
});
app.listen(port, function(){
console.log("Listening on port " + port);
});

