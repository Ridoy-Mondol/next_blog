import mongoose from 'mongoose';
import { DateTime } from 'luxon';
import user from "./signupModel";
import signupUser from "@/models/signupModel";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    blog: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image1: {
        type: String,
        required: true,
    },
    user: {
        name: {
            type: String,
            required: true,
            ref: signupUser,
        },
        profileImage: {
            type: String,
            ref: signupUser,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: user,
            required: true
        },
    },
    date: {
        type: Date,
        default: () => DateTime.now().toJSDate(),
    },       
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
