import express, { Request, Response, NextFunction } from 'express';
import morgan from "morgan"
const app = express();
import cors from 'cors'
import userAPI from "../routes/userApi"
import ("./database")
import cookieParser from "cookie-parser" 


//setings
app.set("port", process.env.PORT || 3001)

//midelware
app.use(morgan("dev"));
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cors({credentials:true, origin:"http://localhost:3000"}))

//routes
app.use("/user", userAPI)

//app

app.get("/", (_req:Request,res:Response, _next:NextFunction)=>{
    res.send("API RUNNING")
})


app.listen(app.get("port"), ()=>{console.log(`app succesfully runnint in port ${app.get("port")}`)})