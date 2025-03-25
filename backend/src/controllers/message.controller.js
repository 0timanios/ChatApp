import cloudinary from "../lib/cloudinary.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

const getUsersForSidebar = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select('-password')
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log('Error in getusersforsidebar conrtroller ', error.message)
        res.status(500).json({message:'Internal server error'})
    }
}

const getMessages = async (req,res) =>{
    try {
        const {id:hisId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:hisId},
                {senderId:hisId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log('Error in getusersforsidebar conrtroller ', error.message)
        res.status(500).json({message:'Internal server error'})
    }
}

const sendMessage = async(req,res) =>{
    try {
        const {text, image } = req.body;
        const { id:hisId} = req.params;
        const myId = req.user._id;
        let imgUrl;
        if (image){
            const uploadRes = await cloudinary.uploader.upload(image);
            imgUrl = uploadRes.secure_url
        }

        const newMessage = new Message({
            senderId:myId,
            receiverId:hisId,
            text,
            image:imgUrl
        })

        await newMessage.save();

        // todo

        res.status(201).json(newMessage)
    } catch (error) {
        console.log('Error in send Message conrtroller ', error.message)
        res.status(500).json({message:'Internal server error'})
    }
}

export {
    getUsersForSidebar,
    getMessages,
    sendMessage
}