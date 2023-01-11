import { Request}  from "express";
import mongoose from "mongoose";

export type userType = {
    name:string,
    password:string,
    email:string;
    id:string,
    _v:string,
}

export interface userInterface extends mongoose.Document{
    name:string,
    password:string,
    email:string;

}

type RequestWithId = Request & {id: userType["id"];}