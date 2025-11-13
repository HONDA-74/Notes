import { Schema , model } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: [true , "name is required"] },
    email: { type: String, unique: [true , "email already exits"], required: [true , "email is required"] },
    password: { type: String, required: [true , "password is required "] },
    phone: { type: String, required: [true , "phone is required"] },
    age: { type: Number, min: 18, max: 60 },
})
export const User = model("users" , userSchema )