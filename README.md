# MERN Stack Product e-commerce website

# MugdhoMart

## Project Overview
This project is a full-stack, single-page application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The website allows users to browse, search, filter, categorize, and sort products efficiently. The goal is implementing key functionalities like pagination, searching, categorization, sorting, and user authentication.

## Features

- **Pagination**: Efficiently loads products with pagination controls (Next, Previous) and displays page numbers.
- **Searching**: Allows users to search for products by name.
- **Categorization**: Users can filter products based on:
  - Brand Name
  - Category Name
  - Price Range
- **Sorting**: Users can sort products by:
  - Price (Low to High, High to Low)
  - Date Added (Newest first)
- **Authentication**: Supports Google Authentication and Email/Password Authentication via Firebase.

## Technologies Used

- **Back-end**:
   - Node.js
  - Express.js
  - MongoDB (Database)

### Setup Instructions

1. **Clone the repository**:
   ```bash
  git@github.com:altaj1/mughdo-mart-server.git
  
    cd your-repo-name
    
2. **Install dependencies:**:
npm install

4. **Set up environment variables**:
   MONGO_URI=your_mongodb_connection_string

5. **Start the development servers**:
nodemon index.js

Access the application:
Open your browser and navigate to http://localhost:8000.
