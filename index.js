import express from "express";
import Email from "./nodeMailer.js"

const app = express();
const port = 8080;
let users = [];


function User(email, password, gamesOwned, gamesPosted, cart, money) {
    this.email = email;
    this.password = password;
    this.gamesOwned = gamesOwned;
    this.gamesPosted = gamesPosted;
    this.cart = cart;
    this.money = money;
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
    return "not found"
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


users.push(new User("admin@test.com","admin",[],[],[], 50));
users.push(new User("user@test.com","user",[],[],[], 50));

app.get("/", (req,res)=>{
        console.log(users);
        res.render("index.ejs");
});
app.get("/signUp",(req,res)=>{
    res.render("signUp.ejs");
});
app.post("/signUp",(req,res)=>{
    console.log(req.body["password"]);

    if(req.body["password"].match(/[0-9]/) && req.body["password"].match(/[a-z]/) && 
       req.body["password"].match(/[A-Z]/) && req.body["password"].match(/[^w]/) && req.body["password"].length >= 6 &&
       req.body["password"] === req.body["confirm-password"]){

       var key = (Math.random()*10).toString().slice(2)
       let email = new Email("Confirm your Email", key, req.body["email"]);
       email.send();

       res.render("confirmEmail.ejs",{email:req.body["email"], password:req.body["password"], key:key}); 

    }else{
        res.redirect("/signUp");
    }
});

app.post("/confirmEmail",(req,res)=>{
    
    if(req.body["confirm-email"] == req.body["a"]){
        users.push(new User(req.body["email"],req.body["password"],[],[],[], 50));
    }
    res.redirect("/");
});

app.post("/login", (req,res)=>{

    let loggedUser = searchUsers(users,req.body["email"]);

    
    if(loggedUser.password === req.body["password"] && req.body["password"] && !req.body["signUp"]){
        
        
        res.render("login.ejs",{User: loggedUser.email, cartSize:loggedUser.cart.length});
        loggedUser = null;
        
        
    }else{
       
        if(req.body["loggedUser"]){
            
            res.render("login.ejs", {User:req.body["loggedUser"],cartSize:searchUsers(users, req.body["loggedUser"]).cart.length});
        
        }else{

                res.redirect("/");
            
        }
    }      
});


app.post("/putCart",(req, res) => {
    let currentUser = searchUsers(users, req.body["loggedUser"]);
    currentUser.cart.push(new Game(req.body["name"],req.body["price"],req.body["img"]));
    res.render("login.ejs",{User:req.body["loggedUser"], cartSize: currentUser.cart.length});
    currentUser = null;
    
});
app.post("/logOut", (req,res)=>{
    res.redirect("/");
});
app.post("/mygames",(req,res)=>{
    let currentUser = searchUsers(users, req.body["loggedUser"]);
    res.render("games.ejs", {User: req.body["loggedUser"], cartSize: currentUser.cart.length});
    
});
app.post("/cart",(req,res)=>{
    let currentUser = searchUsers(users, req.body["loggedUser"]);
    res.render("cart.ejs", {cart:currentUser.cart,i:0,User:req.body["loggedUser"], cartPrice: currentUser.cartPrice(), cartSize: currentUser.cart.length});
    currentUser = null;

});
app.listen(port, function(){
console.log("Listening on port " + port);
});

