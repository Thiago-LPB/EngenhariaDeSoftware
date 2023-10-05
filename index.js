import express from "express";


const app = express();
const port = 8080;
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
var testeUser2 = new User("user@test.com","user",[],[],[]);
users.push(testeUser);
users.push(testeUser2);

app.get("/", (req,res)=>{
        res.render("index.ejs");
});



app.post("/login", (req,res)=>{
    let loggedUser = searchUsers(users,req.body["email"]);
    console.log(req.body["loggedUser"]);

    if(loggedUser.password === req.body["password"] && req.body["password"]){
        res.render("login.ejs",{User: loggedUser.email});
        loggedUser = null;
    }else{
       
        if(req.body["loggedUser"]){
            
            res.render("login.ejs", {User:req.body["loggedUser"]});
            
        

        }else{
            res.redirect("/");
        }
        
    }
    
});


app.post("/putCart",(req, res) => {
    let currentUser = searchUsers(users, req.body["loggedUser"]);
    currentUser.cart.push(new Game(req.body["name"],req.body["price"],req.body["img"]));
    res.render("login.ejs",{User:req.body["loggedUser"]});
    currentUser = null;
    
});
app.post("/logOut", (req,res)=>{
    res.redirect("/");
});
app.post("/mygames",(req,res)=>{

    res.render("games.ejs", {User: req.body["loggedUser"]});
    
});
app.post("/cart",(req,res)=>{
    let currentUser = searchUsers(users, req.body["loggedUser"]);
    res.render("cart.ejs", {cart:currentUser.cart,i:0,User:req.body["loggedUser"], cartPrice: currentUser.cartPrice()});
    currentUser = null;

});
app.listen(port, function(){
console.log("Listening on port " + port);
});

