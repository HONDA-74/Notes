import { User } from "../../db/models/user.model.js"
import bcrypt from "bcrypt"
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken"

export const signup = async (req , res , next) => { 
    try {
        const { name, email, password, phone, age } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }
        if(!phone){
            return res.status(400).json({ success: false, error: 'phone is required' });
        }
        const cryptedPhone = CryptoJS.AES.encrypt( phone , process.env.CRYPTO_KEY ).toString() 
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({name , email , password : hashedPassword , phone : cryptedPhone , age })
        res.status(201).json({ success: true, message: 'User created successfully' , createdUser });
    } catch (error) {
        console.log("signup error " ,error.message);
        res.status(500).json({success : false , Error : error.message});
    }
}

export const login = async (req,res,next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
        return res.status(400).json({ success: false, error: 'Invalid cradinials ' })
        }
        const matchPassword =await bcrypt.compare(password , existingUser.password )
        if(!matchPassword){
            return res.status(400).json({ success: false, error: 'Invalid cradinials ' })
        }
        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        )
        res.status(200).json({ success : true , message: 'Login successful', token });
    } catch (error) {
        console.log("login error" ,error.message);
        res.status(500).json({success : false , Error : error.message});
    }
}

export const update = async (req,res,next) => {
    try {
        const id = req.userId
        const { name , email , phone , age } = req.body
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (phone) updateFields.phone = CryptoJS.AES.encrypt( phone , process.env.CRYPTO_KEY ).toString();
        if (age) updateFields.age = age;
        if(email){
            const emailExisting =await User.findOne({email})
            if(emailExisting) return res.status(400).json({ success: false, error: 'email already exists' })
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log("udate error" ,error.message);
        res.status(500).json({success : false , Error : error.message});
    }
}

export const deleteUser = async (req,res,next) => {
    try {
        const id = req.userId
        const emailExisting =await User.findById(id)
        if(!emailExisting) return res.status(400).json({ success: false, error: 'User not found' })
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.log("delete error" ,error.message);
        res.status(500).json({success : false , Error : error.message});
    }
}

export const getUser = async (req,res,next) => {
    try {
        const id = req.userId
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, message: 'User found successfully. ' , user});
    } catch (error) {
        console.log("get user error" ,error.message);
        res.status(500).json({success : false , Error : error.message});
    }
}