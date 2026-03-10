# AI Chatbot Frontend (React)

Frontend client for the AI Chatbot application built with **React**.  
It provides the user interface for authentication, real-time chat, and AI interaction.

---

## Table of Contents

- Overview
- Architecture
- Tech Stack
- Features
- Project Structure
- WebSocket Integration
- Setup
- Environment Variables
- Future Improvements

---

## Overview

This React application allows users to:

- Register and log in
- Chat with an AI assistant
- View real-time messages
- Access previous conversation history

The frontend communicates with the backend using:

- **REST APIs** for authentication and data
- **WebSocket + STOMP** for real-time messaging

---

## Architecture


React Client
|
REST API (Axios)
|
Spring Boot Backend

React Client
|
WebSocket + STOMP
|
Spring Boot WebSocket Server


### Chat Flow

1. User logs in and receives JWT
2. React connects to WebSocket using STOMP
3. User sends message
4. Message sent to `/app/chat`
5. Backend broadcasts message
6. React receives AI or user responses in real time

---

## Tech Stack

- React
- Vite
- JavaScript / TypeScript
- Axios
- @stomp/stompjs
- sockjs-client
- Tailwind CSS / Material UI

---

## Features

- Login / Register
- Real-time messaging
- WebSocket auto reconnect
- Chat UI
- AI assistant responses
- Message history

---

## Project Structure


src/

components/
ChatWindow
MessageList
MessageInput

pages/
Login
Register
Chat

services/
api.js
websocket.js

context/
AuthContext
ChatContext

hooks/
useChat
useAuth


---

## WebSocket

Subscribe to conversation


/topic/conversations/{conversationId}


Send message


/app/chat


---

## Setup

Clone repository


git clone https://github.com/AmanBhatt0910/ai-chatbot-frontend

Install dependencies

npm install

Start development server

npm run dev

Frontend runs at

http://localhost:5173


---

## Environment Variables

Create `.env`


VITE_API_BASE_URL=http://localhost:8080

VITE_WS_URL=http://localhost:8080/ws-chat


---

## Future Improvements

- Dark mode
- File attachments
- Message reactions
- Mobile responsive UI
- AI conversation suggestions

---