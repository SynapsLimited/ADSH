const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const HttpError = require("../models/errorModel");
const { put } = require('@vercel/blob'); // Import the Vercel Blob library
const multer = require('multer');

// Setup multer to store files in memory for Vercel Blob
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToVercelBlob = async (fileBuffer, fileName) => {
    try {
        const { url } = await put(fileName, fileBuffer, {
            access: 'public', // Make sure the file is publicly accessible
            token: process.env.BLOB_READ_WRITE_TOKEN, // Blob storage token
            headers: {
                Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}` // Vercel API token for authorization
            }
        });
        console.log("Uploaded successfully to Vercel Blob: ", url); // Log URL
        return url; // Return the uploaded file URL
    } catch (error) {
        console.error("Error uploading file to Vercel Blob:", error);
        throw new Error("Failed to upload file to Vercel Blob");
    }
};




// Define allowed emails
const allowedEmails = [
    "bshehaj92@gmail.com",
    "synapslimited@gmail.com",
    "muhamedbrojka@yahoo.com",
    "enriko.shkurti11@gmail.com",
    "yann2045@gmail.com",
    "bujar@synapslimited.eu",
    "muhamed@synapslimited.eu",
    "enrico@synapslimited.eu"
];



// ======================= Register a new User
// POST : api/users/register
//UNPROTECTED

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password || !password2) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();

         // Check if the email is in the allowed list
         if (!allowedEmails.includes(newEmail)) {
            return next(new HttpError("Not authorized to register. Contact Synaps!", 422));
        }

        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Email already exists.", 422));
        }

        if ((password.trim()).length < 6) {
            return next(new HttpError("Password should be at least 6 characters.", 422));
        }

        if (password !== password2) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashedPass });
        res.status(201).json(`New User ${newUser.email} registered.`);
    } catch (error) {
        console.error("Registration Error:", error);
        return next(new HttpError("User Registration failed.", 422));
    }
};


// ======================= Login a registered User
// POST : api/users/login
//UNPROTECTED

const loginUser = async (req, res, next) => {
    try {
        console.log("Raw request body received:", req.body); // Debugging log

        // Trim the values to remove any leading/trailing whitespaces or newlines
        const email = req.body.email ? req.body.email.trim() : '';
        const password = req.body.password ? req.body.password.trim() : '';

        if (!email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({ email: newEmail });
        if (!user) {
            return next(new HttpError("Invalid credentials", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return next(new HttpError("Invalid credentials", 422));
        }

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ token, id, name });
    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials.", 422));
    }
};



// ======================= User Profile
// POST : api/users/:id
//UNPROTECTED

const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if(!user) {
            return next(new HttpError("User not found.", 404))
        }
            res.status(200).json(user);
    }   catch (error) {
        return next(new HttpError(error))
    }
}


// ======================= Change User Avatar (profile picture)
// POST : api/users/change-avatar
// PROTECTED

const changeAvatar = async (req, res, next) => {
    try {
        const file = req.file; // Access the file uploaded by Multer

        if (!file) {
            console.log("No file received");
            return res.status(422).json({ message: "No avatar file provided." });
        }

        console.log("File received: ", file.originalname);

        // Multer stores the file in memory as a buffer
        const avatarBuffer = file.buffer; // Get buffer from memory
        const avatarFileName = `avatars/${Date.now()}.jpg`; // Generate a unique file name

        // Upload to Vercel Blob
        const avatarUrl = await uploadToVercelBlob(avatarBuffer, avatarFileName);
        console.log("Uploaded to Vercel Blob. URL: ", avatarUrl);

        // Find the user in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found." });
        }

        // Update the avatar and avatarPublicId fields
        user.avatar = avatarUrl;  // Set the new avatar URL
        user.avatarPublicId = avatarFileName;  // Set the public ID to track the file

        // Save the user with the new avatar URL in MongoDB
        const updatedUser = await user.save();
        console.log("User updated in MongoDB: ", updatedUser);  // Ensure this log shows the updated document

        // Return the new avatar URL in the response
        return res.status(200).json({ avatar: updatedUser.avatar });
    } catch (error) {
        console.error("Error in changing avatar:", error);
        return res.status(500).json({ message: "Failed to update avatar." });
    }
};








// ======================= Edit User Details (from profile)
// POST : api/users/edit-user
//UNPROTECTED

const editUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError("Fill in all fields", 422))
        }

        // get user from database
        const user = await User.findById(req.user.id);
        if(!user) {
            return next(new HttpError("User not found", 403))
        }


        //make sure new email doesn't already exist
        const emailExist = await User.findOne({email});

        if(emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError("Email already exist.", 422))
        }

        // compare current password to db password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
            if(!validateUserPassword) {
                return next(new HttpError("Invalid current password.", 422))
            }

        //compare new passwords
        if(newPassword !== confirmNewPassword) {
            return next(new HttpError("New passwords do not match.", 422))
        }

        //hash new password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt);

        //update user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hash}, {new: true})
        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError(error))
    }
}


// ======================= Get Authors
// POST : api/users/authors
//UNPROTECTED

const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    }   catch (error) {
        return next(new HttpError(error))
    }
}



module.exports = {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors }