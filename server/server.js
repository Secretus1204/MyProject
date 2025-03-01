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
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost/Projects/CST5-Final-Project/client/messagePage.php"]
    }
});

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    socket.on('enterRoom', async ({ user_id, chat_id }) => {
        try {
            // Validate user via PHP
            const response = await fetch("http://localhost/Projects/CST5-Final-Project/SQL/dbquery/chatValidation.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, chat_id })
            });

            const data = await response.json();

            if (!data.success) {
                socket.emit("errorMessage", "You are not a member of this chat.");
                return;
            }

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
            socket.emit('message', buildMessage(ADMIN, `You joined chat ${chat_id}.`));
            
            socket.broadcast.to(chat_id).emit('message', buildMessage(ADMIN, `User ${user_id} joined the chat.`));

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
        await fetch("http://localhost/yaphub/api/save_message.php", {
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
