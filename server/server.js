const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const feedbackList = [];

app.get("/", (req, res) => {
  res.send("Internee.pk AI Chatbot Server is running.");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("bot_message", {
    text: "Welcome to Internee.pk AI Assistant. How can I help you today?",
  });

  socket.on("user_message", async (data) => {
    const userMessage = data?.message;

    if (!userMessage || userMessage.trim() === "") {
      socket.emit("bot_message", {
        text: "Please type a valid question.",
      });
      return;
    }

    try {
      socket.emit("bot_typing", true);

      let botReply = "";

      if (!process.env.OPENAI_API_KEY) {
        botReply =
          "Demo response: Please add your OpenAI API key in the backend .env file to enable real AI responses.";
      } else {
        const response = await openai.responses.create({
          model: process.env.OPENAI_MODEL || "gpt-4.1",
          input: [
            {
              role: "developer",
              content:
                "You are Internee.pk AI Assistant. Answer internship-related questions in a helpful, simple, and professional way. Help interns with assignments, deadlines, learning guidance, GitHub, LinkedIn posting, React Native, and general internship support. Keep answers concise.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        });

        botReply =
          response.output_text ||
          "Sorry, I could not generate a response right now.";
      }

      socket.emit("bot_message", {
        text: botReply,
      });
    } catch (error) {
  console.error("OpenAI Error:", error.message);

  let fallbackReply =
    "I am currently running in demo mode because the OpenAI API quota is not available. You can still ask internship-related questions, and I will provide basic guidance.";

  if (userMessage.toLowerCase().includes("assignment")) {
    fallbackReply =
      "For assignments, first read the requirements, build the app features step by step, test it in Expo Go, push the code to GitHub, and share your work on LinkedIn.";
  } else if (userMessage.toLowerCase().includes("github")) {
    fallbackReply =
      "To submit on GitHub, create a repository, commit your project files, push them to GitHub, and add a proper README explaining the assignment features.";
  } else if (userMessage.toLowerCase().includes("linkedin")) {
    fallbackReply =
      "For LinkedIn, write a short post explaining what you built, mention the technologies used, add screenshots of the app, and include internship-related hashtags.";
  } else if (userMessage.toLowerCase().includes("react native")) {
    fallbackReply =
      "React Native is a framework used to build mobile apps for Android and iOS using JavaScript and React concepts.";
  }

  socket.emit("bot_message", {
    text: fallbackReply,
  });
    } finally {
      socket.emit("bot_typing", false);
    }
  });

  socket.on("feedback", (data) => {
    const feedback = {
      socketId: socket.id,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };

    feedbackList.push(feedback);

    console.log("New Feedback:", feedback);

    socket.emit("feedback_saved", {
      message: "Thank you! Your feedback has been submitted.",
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});