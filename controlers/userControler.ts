import User from "../models/userModel"
import { userType } from "../types";
import { Request, Response, NextFunction }  from "express";
import bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import path from 'path';
import * as dotenv from "dotenv";
dotenv.config({ path:path.join(__dirname, '..', '.env.local')});


const jwtKey: string= process.env.WEB_TOKEN_KEY!



export const signup = async (req: Request, res: Response, _next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    // Try to find a user with the provided email
    const existingUser = await User.findOne({ email });

    // If a user with the provided email already exists, return a response indicating that the user should login instead
    if (existingUser) {
      return res.status(400).json({ message: "user already exist, please login" });
    }

    // Hash the user's password using bcrypt
    const hashedPassword = bcrypt.hashSync(password);

    // Create a new user with the provided information and save it into the database
    const user = new User({
      name,
      email,
      password:hashedPassword,
    });
    await user.save();
    // Return a response with the newly created user
    return res.status(201).json({ message: "Signed succesfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async(req: Request, res: Response, _next: NextFunction) => {
  const { password, email } = req.body;

  try {
    // Attempt to find a user with the given email in the database
    const existingUser = await User.findOne({ email });

    // If no user was found, return a response with a 400 status code and a message
    if (!existingUser) {
      return res.status(404).json({ message: "user don't exist, Signup please" });
    } else {
    // If a user was found with the given email, create a JSON Web Token with the user's id and a secret
      const token = jwt.sign({id:existingUser._id},jwtKey,{expiresIn:"1h"})
      
      
      // Compare the provided password with the hashed password stored in the database for the user
      const passwordValid = await bcrypt.compare(password, existingUser.password);

      // If the passwords do not match, return a response with a 400 status code and a message
      if (!passwordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      res.cookie(String(existingUser._id),token,{
        expires: new Date(Date.now() + 1000 * 1200 ),
        httpOnly:true,
      })
      

      // If the passwords match, return a response with a 200 status code and a success message
      return res.status(200).json({ message: 'Succesfully Logged In', existingUser, token });
    }
   
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while logging in.' });
  }
}



export const verifyToken = async (req: Request , res: Response, next: NextFunction) => {
  
  console.log(req.headers)
  // Check for the existence of the cookie header
  if (!req.headers.cookies) {
    // If the authorization header is not present, return a 404 response with a message
    return res.status(404).json({ messaje: "no token found" });
  }
  // Split the value of the cookie to extract the token
  var cookies = String(req.headers.cookies)
  var token = cookies.split("=")[1]

  try {
    const user =  jwt.verify(String(token), jwtKey) as userType;
    // Check whether the user object has an id property
    if (user.hasOwnProperty("id")) {
      console.log(user.id);
    // attach the id property attach it to the request object
      (req as Request & { id: userType["id"] }).id = user.id;
      next();
      return res.status(200);
    } else { return res.status(404).json({ messaje: "Invalid Token" });}
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'An error occurred but is not your fault.' });
  }
};



export const getUser = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const userData = (req as Request & { id: userType["id"]}).id

    // Use the findById method on the User model to find the user by id filtering the password
    const user = await User.findById(userData, "-password");
    // If the user is not found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    //If the user is found, return a 200 OK response with the user data
    return res.status(200).json({messagee:user});
  } catch (err) {
    // In case of an error, log the error to the console and return a 500 Internal Server Error response
    console.log(err);
    return res.status(500).json({ message: 'An error occurred but is not your fault.' });
  }
}


