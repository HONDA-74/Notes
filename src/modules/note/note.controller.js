import { Router } from "express";
import * as noteService from "./note.service.js"
import { authenticate } from "../../middlewares/auth.middleware.js";
const router = Router()
router.post("/" , authenticate , noteService.createNote )
router.patch("/all" , authenticate , noteService.updateALl )
router.patch("/:noteId" , authenticate , noteService.updateNote )
router.put("/replace/:noteId" , authenticate , noteService.replaceNote )
router.delete("/:noteId" , authenticate , noteService.deleteNote )
router.get("/paginate-sort" , authenticate , noteService.getPaginatedNotes )
router.get("/note-by-content" , authenticate , noteService.getNoteByContent )
router.get("/note-with-user" , authenticate , noteService.getNotesWithUserInfo )
router.get("/aggregate" , authenticate , noteService.getAggregatedNotes )
router.get("/:id" , authenticate , noteService.getNoteById )
router.delete("/delete-all/:noteId" , authenticate , noteService.deleteAllNotes )
export default router