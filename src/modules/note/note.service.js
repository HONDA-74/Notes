import mongoose from "mongoose"
import { Note } from "../../db/models/note.model.js"
import { User } from "../../db/models/user.model.js"


export const createNote = async (req,res,next) => {
    try {
        const id = req.userId
        const { title , content }= req.body
        const createdNote =await Note.create({title , content , userId : id}) 
        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note: createdNote,
        })
    } catch (error) {
        console.log("create note error" ,error.message);
        res.status(500).json({success : false , Error : error.message});
    }
}

export const updateNote = async (req,res,next) => {
    try {
        const userId = req.userId
        const noteId = req.params.noteId
        const {title , content }= req.body
        const updateFields = {};
        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        const note = await Note.findById(noteId)
        if(!note) return res.status(404).json({success: false, error: "Note not found" })
        if(note.userId != userId )  return res.status(404).json({success: false, error: "you are not the owner" })   
        const updatedNote = await Note.findByIdAndUpdate(noteId , updateFields , {new: true , runValidators : true})
        res.status(200).json({ success: true, message: "note updated successfully", updatedNote });
    } catch (error) {
        console.log("update note error" ,error.message);
        res.status(500).json({success : false , Error : error.message});
    }
}

export const replaceNote = async (req,res,next) => {
    try {
        const userId = req.userId
        const noteId = req.params.noteId
        const {title , content }= req.body
        const updateFields = {};
        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        const note = await Note.findById(noteId)
        if(!note) return res.status(404).json({success: false, error: "Note not found" })
        if(note.userId != userId )  return res.status(404).json({success: false, error: "you are not the owner" })   
        await Note.replaceOne({_id:noteId , userId } , { ...updateFields, userId }, {runValidators : true})
        const updatedNote = await Note.findById(noteId)
        res.status(200).json({ success: true, message: "note updated successfully", updatedNote })
    } catch (error) {
        console.log("replace note error" ,error.message);
        res.status(500).json({success : false , Error : error.message});
    }
}

export const updateALl = async (req,res,next) => {
    try {
        const userId = req.userId
        const { title }= req.body 
        const updatedNotes = await Note.updateMany({ userId } , { $set: { title } } )
        if (updatedNotes.matchedCount == 0) {
            return res.status(404).json({
                success: true,
                message: "No notes found for the logged-in user",
            })
        }
        res.status(200).json({ success: true, message: "notes updated successfully", updatedNotes })
    } catch (error) {
        console.log("update all note error" ,error.message);
        res.status(500).json({success : false , Error : error.message})
    }
}

export const deleteNote = async (req, res, next) => {
    try {
        const userId = req.userId;
        const noteId = req.params.noteId; 
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ success: false, error: "Note not found" })
        }
        if (note.userId != userId) {
            return res.status(403).json({ success: false, error: "You are not the owner" })
        }
        const deletedNote = await Note.findByIdAndDelete(noteId);
        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            deletedNote,
        })
    } catch (error) {
        console.error("Error deleting note:", error.message)
        res.status(500).json({ success: false, error: error.message })
    }
}

export const getPaginatedNotes = async (req, res, next) => {
    try {
        const userId = req.userId; 
        const { page = 1, limit = 5 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        const notes = await Note.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);
        res.status(200).json({
            success: true,
            currentPage: pageNumber,
            notes,
        })
    } catch (error) {
        console.error("Error retrieving paginated notes:", error.message)
        res.status(500).json({ success: false, error: error.message })
    }
}

export const getNoteById = async (req, res, next) => {
    try {
        const userId = req.userId
        const { id } = req.params
        const note = await Note.findOne({ _id: id })
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found " })
        }
        if (note.userId != userId){
            return res.status(404).json({ success: false, message: "you are not the onwer" })
        }
        res.status(200).json({ success: true, note })
    } catch (error) {
        console.error("Error retrieving note by ID:", error.message)
        res.status(500).json({ success: false, message: "Failed to fetch the note." })
    }
}

export const getNoteByContent = async (req, res, next) => {
    try {
        const userId = req.userId
        const { content } = req.query
        const note = await Note.findOne({ content: { $regex: content, $options: "i" } })
        if (!note) {
            return res.status(404).json({ success: false, message: "No note found " })
        }
        if (note.userId != userId){
            return res.status(404).json({ success: false, message: "you are not the onwer" })
        }
        res.status(200).json({ success: true, note })
    } catch (error) {
        console.error("Error retrieving note by content:", error.message)
        res.status(500).json({ success: false, message: "Failed to fetch the note." })
    }
}

export const getNotesWithUserInfo = async (req, res, next) => {
    try {
        const userId = req.userId;
        User
        const notes = await Note.find({ userId })
            .select("title userId createdAt")
            .populate({ path: "userId", select: "email" }) 
        if (!notes || notes.length == 0) {
            return res.status(404).json({ success: false, message: "No notes found " })
        }
        res.status(200).json({ success: true, notes })
    } catch (error) {
        console.error("Error retrieving notes with user info:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch notes." })
    }
}

export const getAggregatedNotes = async (req, res, next) => {
    try {
        const userId = req.userId
        const { title } = req.query;
        const pipeline = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    ...(title && { title: { $regex: title, $options: "i" } })
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "userId", 
                    foreignField: "_id", 
                    as: "userInfo" 
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    "userInfo.name": 1,
                    "userInfo.email": 1
                }
            }
        ];
        const notes = await Note.aggregate(pipeline);
        if (!notes || notes.length == 0) {
            return res.status(404).json({ success: false, message: "No notes found." })
        }
        res.status(200).json({ success: true, notes })
    } catch (error) {
        console.error("Error retrieving aggregated notes:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch notes." })
    }
}

export const deleteAllNotes = async (req, res) => {
    try {
        const userId = req.userId
        const result = await Note.deleteMany({ userId });
        if (result.deletedCount == 0) {
            return res.status(404).json({ success: false, message: "No notes found to delete." })
        }
        res.status(200).json({ success: true, message: "All notes have been deleted successfully." })
    } catch (error) {
        console.error("Error deleting notes:", error.message);
        res.status(500).json({ success: false, message: "Failed to delete notes." })
    }
}



