import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // Use to make requests to PHP

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5500;
const ADMIN = "Admin";

const UsersState = new Map(); // Stores { socketId -> { user_id, chat_id } }

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const expressServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin: ["http://localhost", "http://127.0.0.1:5500"], // Allow frontend
        methods: ["GET", "POST"], // Restrict to only necessary methods
        credentials: true // Allow credentials (if needed)
    }
});


io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('enterRoom', async ({ user_id, chat_id }) => {
        try {
            console.log(`Attempting to validate user ${user_id} for chat ${chat_id}`);
    
            // Validate user via PHP
            const response = await fetch("http://localhost/Projects/CST5-Final-Project/SQL/dbquery/chatValidation.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, chat_id })
            });
    
            console.log("Response Status:", response.status);
            console.log("Response Headers:", response.headers.raw());
    
            // Read raw response before parsing
            const rawText = await response.text();
            console.log("Raw Response:", rawText);
    
            // Try parsing JSON
            let data;
            try {
                data = JSON.parse(rawText);
                console.log("Parsed JSON:", data);
            } catch (jsonError) {
                console.error("JSON Parsing Error:", jsonError);
                socket.emit("errorMessage", "Invalid server response. Please check the server logs.");
                return;
            }
    
            if (!data.success) {
                console.warn(`Validation failed: ${data.message}`);
                socket.emit("errorMessage", "You are not a member of this chat.");
                return;
            }
    
            console.log(`User ${user_id} successfully validated for chat ${chat_id}`);
    
            // Leave previous room
            const prevRoom = UsersState.get(socket.id)?.chat_id;
            if (prevRoom) {
                socket.leave(prevRoom);
                io.to(prevRoom).emit('message', buildMessage(ADMIN, `User ${user_id} left chat ${prevRoom}.`));
            }
    
            // Store user session in UsersState
            UsersState.set(socket.id, { user_id, chat_id });
            socket.join(chat_id);
    
            // Notify everyone in the chat
            socket.emit('joinChat', notifyMessage(ADMIN, `You joined chat ${chat_id}.`));
    
            // Update user list for the chat
            io.to(chat_id).emit('userList', {
                users: Array.from(UsersState.values()).filter(u => u.chat_id === chat_id).map(u => u.user_id)
            });
    
        } catch (error) {
            console.error("Error entering room:", error);
            socket.emit("errorMessage", "Failed to join the chat.");
        }
    });
    

    // When user disconnects
    socket.on('disconnect', () => {
        const user = UsersState.get(socket.id);
        if (user) {
            UsersState.delete(socket.id);
            io.to(user.chat_id).emit('message', buildMessage(ADMIN, `User ${user.user_id} left the chat.`));
            io.to(user.chat_id).emit('userList', {
                users: Array.from(UsersState.values()).filter(u => u.chat_id === user.chat_id).map(u => u.user_id)
            });
        }

        console.log(`User ${socket.id} disconnected`);
    });

    // Listening for messages
    socket.on('message', async ({ user_id, chat_id, text }) => {
        const user = UsersState.get(socket.id);
        if (!user || user.chat_id !== chat_id) return;

        // Store message in the database via PHP
        await fetch("http://localhost/Projects/CST5-Final-Project/SQL/dbquery/save_message.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, chat_id, text })
        });

        // Broadcast message
        io.to(chat_id).emit('message', buildMessage(user_id, text));
    });
});

// Function to build messages
function buildMessage(user_id, text) {
    return {
        user_id,
        text,
        time: new Date().toLocaleTimeString()
    };
}

function notifyMessage(user_id, text){
    return{
        user_id,
        text
    };
}
