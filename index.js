
import  express from 'express'
import path from "path"
import mongoose  from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
})
.then(() => console.log("Database Connected"))
.catch(error => console.error("Error:", error));

const Userschema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
})

const User=mongoose.model("user",Userschema)


const app=express();
app.use(express.static(path.join(path.resolve(),"/public")));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.set("view engine", "ejs");

f
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/",isAthun,(req,res)=>{
    
    res.render("logout",{name:req.user.name});
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    let user=await User.findOne({email});
    if(!user){
        return res.redirect("/register");
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch) return res.render("login",{email, mesfsage:"Incorrect password"});
    
    
    const token=jwt.sign({id:user.id},"adfjkadf");
    res.cookie("token",token,{
        httpOnly:true,
        expires: new Date(Date.now()+20*1000),
    });
    res.render("logout", {name: user.name});
})
app.post("/register",async(req,res)=>{
    const{name,email,password}=req.body;
     let user=await User.findOne({email});
     if(user){
       return res.redirect("/login");
     }
     const hash= await bcrypt.hash(password,10);
     user = await User.create({
        name,
        email,
        password:hash,
    });
    const token=jwt.sign({id:user.id},"adfjkadf");
    res.cookie("token",token,{
        httpOnly:true,
        expires: new Date(Date.now()+20*1000),
    });
    res.redirect("/");
});

app.get("/logout",(req,res)=>{
    res.cookie("token","",{
        httpOnly:true,
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});
app.listen(5000,()=>{
    console.log("Server is started.");
})