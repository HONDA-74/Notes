import { Schema , model , Types} from "mongoose";

const noteSchema = new Schema({
    title: {
        type : String ,
        required : true,
        validate: {
            validator: function (value) {
                return value != value.toUpperCase();
            },
            message: 'Title must not be entirely uppercase.',
    },
    },
    content: { type: String, required: true },
    userId: { type: Types.ObjectId , ref: 'users', required: true },
},
{
    timestamps : true
})
export const Note = model("notes" , noteSchema)