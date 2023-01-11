import path from 'path';
import * as dotenv from "dotenv";
dotenv.config({ path:path.join(__dirname, '..', '.env.local')});
import mongoose from "mongoose"
const URI: string = process.env.DB_URI!

mongoose.connect( URI )
    .then(_db => {console.log("database running succesfully")})
    .catch(err=>{console.error(err)})

module.exports = mongoose;