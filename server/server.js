import express from 'express';
import { Server } from 'socket.io';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import configRouter from './config.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const ADMIN = "Admin";
const CHAT_VALIDATION_URL = process.env.CHAT_VALIDATION_URL;
const SAVE_MESSAGE_URL = process.env.SAVE_MESSAGE_URL;
const CORS_ORIGINS = ["https://yaphubers.ct.ws"]; // ✅ Updated with your new domain

const UsersState = new Map(); // Stores { socketId -> { user_id, chat_id } }

const app = express();
app.use(express.json());

// ✅ Enable CORS for your domain
app.use(cors({
    origin: CORS_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
}));

app.use('/api', configRouter);
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!" });
});

const expressServer = app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: CORS_ORIGINS,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`🟢 User ${socket.id} connected`);

    socket.on('enterRoom', async ({ user_id, chat_id }) => {
        try {
            console.log(`🔍 Validating user ${user_id} for chat ${chat_id}...`);

            const response = await fetch(CHAT_VALIDATION_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, chat_id })
            });

            if (!response.ok) {
                console.error(`❌ Validation request failed with status: ${response.status}`);
                socket.emit("errorMessage", "Validation service is unavailable.");
                return;
            }

            const rawText = await response.text();
            let data;

            try {
                data = JSON.parse(rawText);
            } catch (jsonError) {
                console.error("❌ JSON Parsing Error:", jsonError, "Response:", rawText);
                socket.emit("errorMessage", "Invalid server response.");
                return;
            }

            if (!data.success) {
                console.warn(`❌ Validation failed: ${data.message}`);
                socket.emit("errorMessage", "You are not a member of this chat.");
                return;
            }

            console.log(`✅ User ${user_id} validated for chat ${chat_id}`);

            // Leave previous room if exists
            const prevRoom = UsersState.get(socket.id)?.chat_id;
            if (prevRoom) {
                socket.leave(prevRoom);
                io.to(prevRoom).emit('join_leftChat', notifyMessage(user_id, `left chat ${prevRoom}.`));
            }

            // Store user session
            UsersState.set(socket.id, { user_id, chat_id });
            socket.join(chat_id);

            // Notify chat
            io.to(chat_id).emit('join_leftChat', notifyMessage(user_id, `joined chat ${chat_id}.`));

            // Update user list
            updateUserList(chat_id);

        } catch (error) {
            console.error("❌ Error entering room:", error);
            socket.emit("errorMessage", "Failed to join the chat.");
        }
    });

    socket.on("message", async ({ user_id, chat_id, text, file_url, file_type }) => {
        try {
            const user = UsersState.get(socket.id);
            if (!user || user.chat_id !== chat_id) return;

            const messageData = { user_id, chat_id, text, file_url, file_type };

            const dbResponse = await fetch(SAVE_MESSAGE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageData),
            });

            if (!dbResponse.ok) {
                console.error("❌ Database error: Message failed to store.");
                socket.emit("errorMessage", "Message could not be saved.");
                return;
            }

            console.log(`📩 Message from ${user_id} in chat ${chat_id}:`, text || file_url);

            io.to(chat_id).emit("message", messageData);

        } catch (error) {
            console.error("❌ Error sending message:", error);
            socket.emit("errorMessage", "Failed to send the message.");
        }
    });

    socket.on("typing", ({ user_id, chat_id }) => {
        socket.to(chat_id).emit("typing", user_id);
    });

    socket.on("stopTyping", ({ user_id, chat_id }) => {
        socket.to(chat_id).emit("stopTyping", user_id);
    });

    socket.on('disconnect', () => {
        const user = UsersState.get(socket.id);
        if (user) {
            UsersState.delete(socket.id);
            io.to(user.chat_id).emit('join_leftChat', notifyMessage(user.user_id, `left the chat.`));
            updateUserList(user.chat_id);
        }

        console.log(`🔴 User ${socket.id} disconnected`);
    });
});

// ✅ Helper function to build messages
function notifyMessage(user_id, text) {
    return {
        user_id,
        text,
        time: new Date().toLocaleTimeString()
    };
}

// ✅ Helper function to update user list
function updateUserList(chat_id) {
    io.to(chat_id).emit('userList', {
        users: Array.from(UsersState.values()).filter(u => u.chat_id === chat_id).map(u => u.user_id)
    });
}
