import mongoose from "mongoose"
import { userInterface } from "../types"


export const userScheema = new mongoose.Schema(
    {
        name: {type: String, required:true },
        email: {type: String, required:true, unique:true},
        password:{type: String, required:true}
    }
)

export default mongoose.model<userInterface>("user", userScheema)