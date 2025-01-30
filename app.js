const url = "mongodb+srv://varun:varun123@cluster0.fyeln.mongodb.net//Mern-Expense";
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

app.use(express.json());
app.use(cors());


// const url = "mongodb://localhost:27017/Mern";
const port = 8001;

mongoose
  .connect(url)
  .then(() => {
    console.log("DB connected");
    app.listen(port, () => {
      console.log(`MY server is Running http://localhost:${port}`);
    });
  })
  .catch((err) => console.error('Error connecting to DB:', err));

// Mongoose Schema and Model
const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
});

const expenseModel = mongoose.model("Expense", expenseSchema); 

// Routes

// Add a new expense
app.post("/api/expenses", async (req, res) => {
  const { title, amount } = req.body;
  const newExpense = new expenseModel({
    id: uuidv4(),
    title,
    amount,
  });

  try {
    const savedExpense = await newExpense.save();
    res.status(200).json(savedExpense);
  } catch (err) {
    res.status(500).json({ message: 'Error saving expense', error: err });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { title, amount } = req.body;

  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
      { id },
      { title, amount },
      { new: true }
    );
    if (updatedExpense) {
      res.status(200).json(updatedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating expense', error: err });
  }
});

app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await expenseModel.find({});
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses', error: err });
  }
});


app.get("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await expenseModel.findOne({ id });
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expense', error: err });
  }
});

// Delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedExpense = await expenseModel.findOneAndDelete({ id });
    if (deletedExpense) {
      res.status(200).json(deletedExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting expense', error: err });
  }
});

// Delete all expenses
app.delete("/api/expenses", async (req, res) => {
  try {
    const deletedExpenses = await expenseModel.deleteMany({});
    res.status(200).json(deletedExpenses);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting expenses', error: err });
  }
});


// /Authentication/



// const bcrypt=require("bcryptjs")
// const jwt = require("jsonwebtoken")

// const userSchema = new mongoose.Schema({
//     username:{type:String,required:true, unique:true},
//     password:{type:String,required:true}
// });

// const User=mongoose.model("User",userSchema);


// app.post("/api/signup",async (req,res)=>{
//     const {username,password}=req.body;

//     if(!username || !password){
//         return res.status(400).json({message:"Username and password are required"});
//     }

//     const existingUser = await User.findOne({username});
//     if(existingUser){
//         return res.status(400).json({message:"Username already exists"});
//     }

//     const hashedPassword =await bcrypt.hash(password,10);

//     const newUser = new User({
//         username,
//         password:hashedPassword
//     });

//     await newUser.save();
//     return res.status(201).json({message:"User registered successfully"});

// });



// app.get("/api/login",async (req,res)=>{
//     const {username,password}=req.body;

//     if(!username || !password){
//         return res.status(400).json({message:"Username and password are required"});
//     }

//     const user = await User.findOne({username});
//     if(!user){
//         return res.status(400).json({message:"No user"});
//     }

//     const isValid =await bcrypt.compare(password,user.password);

//     if(!isValid){
//         return res.status(401).json({message:"Invalid cridentials"});

//     }
//     const token = jwt.sign({username},"prince",{expiresIn:"1h"});

//     return res.status(201).json({message:"User login successfully","token":token});

// });


// app.get("/api/login_details/:username",authenticateToken,async (req,res)=>{
//     const {username}=req.params;

//     const user = await User.findOne({username});
//     if(!user){
//         return res.status(400).json({message:"No user"});
//     }
//     return res.status(201).json({"password":user.password});

// });

// //MiddleWare
// function authenticateToken(req,res,next){
//     const token = req.header("Authorization")?.split(" ")[1];
//     if(!token) return res.sendStatus(401).json({message:"Null Token"});

//     jwt.verify(token,"prince",(err,user)=>{
//         if(err) return res.status(403).json({message:"Invalid Token"});
//         req.user = user;
//     next();
// });
// }
