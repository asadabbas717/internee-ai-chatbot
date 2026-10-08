# Internee.pk AI Chatbot App

This project was developed as part of my Internee.pk React Native Internship Assignment 4.

## Overview

The app is an AI-powered chatbot designed to assist interns with internship-related queries in real time. It includes a React Native mobile app and a Node.js backend server.

## Features

- Real-time chatbot interface
- AI-powered responses
- Internship-related query handling
- Socket.io real-time communication
- User feedback form
- Backend API integration
- Secure OpenAI API handling through backend

## Technologies Used

- React Native
- Expo
- Node.js
- Express.js
- Socket.io
- OpenAI API

## Project Structure

```text
InterneeAIChatbot
├── mobile
│   └── React Native Expo app
└── server
    └── Node.js Socket.io backend
```

## Repository status

The backend source is present. The `mobile` entry is a Git submodule pointer without a retrievable source URL in this repository snapshot; the mobile app cannot currently be reproduced from this repository alone.

## Backend setup

Install Node.js and npm. From `server/`:

```bash
npm install
npm start
```

Before startup, configure `OPENAI_API_KEY` in a local `server/.env` file; keep it private. Optional `OPENAI_MODEL` selects the model and `PORT` defaults to 3000. OpenAI requests can incur charges. The API key stays on the backend.

## Limits

The server includes hard-coded fallback replies on request failure. A missing-key demo branch exists, but the client is constructed at startup, so do not assume keyless startup works. Feedback is held in memory and logged; it is not durable storage. No authentication or rate limiting is implemented, and CORS is permissive. Use only for local demonstration, with synthetic feedback. Backend startup and device behavior were not tested in this presentation review.
