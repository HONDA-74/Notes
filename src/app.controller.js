import { connectDB } from "./db/connection.js"
import userRouter from "./modules/user/user.controller.js"
import noteRouter from "./modules/note/note.controller.js"
const bootstrap = async (app , express) =>{
    await connectDB()
    app.use(express.json())
    app.use("/users" , userRouter )
    app.use("/notes" , noteRouter )
    app.all("*" , (req,res,next)=>{return res.status(404).json({success : false , message : "invalid url"})})
}
export default bootstrap