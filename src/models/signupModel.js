import mongoose from 'mongoose';

const signupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: String,       
});

const blog_user = mongoose.models.blog_user || mongoose.model("blog_user", signupSchema);

export default blog_user;
