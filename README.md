# Dream Diary

## Introduction

Dream Diary is a full-stack web application designed to help users manage their dream diaries. This application allows users to keep track of their dreams, whether they are private or public. Key features include CRUD operations, word cloud visualization, sentiment analysis, tag summary, and a "like" system. The application is built using the MVC architecture and provides a robust platform for dream management and analysis.

## Features

- **CRUD Operations:** Create, read, update, and delete dream entries.
- **Word Cloud Visualization:** Visualize the most frequently used words in dream descriptions.
- **Sentiment and Tag Summary:** Visualize tags and sentiment associated with dreams.
- **Like System:** Users can like/unlike dream entries, with the number of likes displayed.

## How to Run

### Prerequisites
- Node.js: Install JavaScript runtime.
- MongoDB: Install NoSQL database for data storage.
- Cloudinary Account: Sign up for a Cloudinary account and obtain your Cloudinary credentials.

### Install dependencies
```
npm install
```

### Setup environment variables for external API
Cloudinary: 
```
CLOUDINARY_CLOUD_NAME=yourcredentials
CLOUDINARY_KEY=yourcredentials
CLOUDINARY_SECRET=yourcredentials
```
### Run the app
```
node app.js
```

## Tech Stack Used

### Frontend:
- JavaScript: For client-side interactivity.
- EJS: For rendering dynamic HTML templates.
### Backend:
- Node.js: Server-side JavaScript runtime.
- Express.js: Web framework for handling HTTP requests.
### Database:
- MongoDB: For storing dream entries, user data, and other related information.
### Authentication:
- Passport.js: For user authentication and session management.
