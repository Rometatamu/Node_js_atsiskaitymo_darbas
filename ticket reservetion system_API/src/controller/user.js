import {v4 as uuidv4} from "uuid";
import bcrypt from "bcryptjs";
import UserModel from "../module/user.js";
import jwt from "jsonwebtoken";

const GET_USER_BY_ID = async (req, res)=>{
    try{
        const id=req.params.id;
        const user=await UserModel.findOne({id:id});
        if(!user){
         return res.status(404).json({message: `The user does not exist`});
        }
        if (id !== req.body.userId){
            return res.status(403).json({ message: "You can see only data that belongs to you."});
        }

        return res.status(200).json({response: `status`, user: user});
      } catch(err){
          console.log(err);
          return res.status(500).json({massage: `Server error`});
      }
};
const GET_ALL_USERS= async(req, res)=>{
    try{
        const users=await UserModel.find().sort({"name": 1 }).select(`name`);
        res.status(200).json({users: users});
    } catch(err){
      console.log(err);
      return res.status(500).json({mesage:`Server error`});
    }
};
const SIGN_UP= async (req, res)=> {
    try{
        if(!req.body.name || !req.body.email || !req.body.password || !req.body.money_balance){
            return res.status(400).json({message: "You didn't provided necessary data"});
        }
        const password = req.body.password;
        if (!/^(?=.*\d).{6,}$/.test(password)) {
            return res.status(400).json({ message: "The password must be at least 6 characters long and contain at least one number" });
        }
      const salt=bcrypt.genSaltSync(10);  
      const hash=bcrypt.hashSync(req.body.password, salt); 

      const user= { 
        name: req.body.name,
        email: req.body.email,
        money_balance: req.body.money_balance,
        id: uuidv4(),
        password: hash,
     };
     const newUser= new UserModel(user);
     try {
        await newUser.save();
    } catch (validationError) {
        return res.status(400).json({ message: 'User validation failed', errors: validationError.errors });
    }
     const jwtToken=jwt.sign(
        {
            email: newUser.email,
            userId: newUser.id,
        }, process.env.JWT_SECRET,
        {expiresIn: "2H"}
     );
     const jwtRefreshToken = jwt.sign(
        {
            email: newUser.email,
            userId: newUser.id,
        }, process.env.JWT_SECRET,
        { expiresIn: "1d" } 
     );

     return res.status(201).json({
        user: newUser,
        jwtToken: jwtToken,
        jwtRefreshToken: jwtRefreshToken,
        message: `Registration successful`});
    } catch(err){
        console.log(err);
        return res.status(500).json({message: `Server error`});
    }
};
const LOGIN= async (req, res)=> {
    const user= await UserModel.findOne({email: req.body.email});
    if(!user){
        return res.status(403).json({message: "Bad authorization"})
    }
    const isPasswordMatch=bcrypt.compareSync(req.body.password, user.password);
    if(!isPasswordMatch){
        return res.status(403).json({message: "Bad authorization"});
    }
    const jwtToken=jwt.sign(
        {
            email: user.email,
            userId: user.id,
        }, process.env.JWT_SECRET,
        {expiresIn: "2H"}
    );
    const jwtRefreshToken=jwt.sign(
        {
            email: user.email,
            userId: user.id,
        }, process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );
    return res.status(200).json({jwtToken: jwtToken, jwtRefreshToken: jwtRefreshToken, message: "Login was successfull"});

};
const GET_NEW_JWT_TOKEN = async (req, res) => {
    try {
        const { jwtRefreshToken } = req.body;

        if (!jwtRefreshToken) {
            return res.status(400).json({ message: "Refresh token is missing" });
        }
        jwt.verify(jwtRefreshToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Invalid or expired refresh token. Please log in again." });
            }
            const newJwtToken = jwt.sign(
                {
                    email: decoded.email, 
                    userId: decoded.userId,
                },  process.env.JWT_SECRET,
                { expiresIn: "2h" } 
            );
            return res.status(200).json({
                jwtToken: newJwtToken,
                jwtRefreshToken: jwtRefreshToken, 
                message: "New JWT token generated successfully"
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Server error` });
    }
};

export {GET_USER_BY_ID, GET_ALL_USERS, SIGN_UP, LOGIN, GET_NEW_JWT_TOKEN};