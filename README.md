# Fullstack Dynamic Blog Web Application

## Overview

This is a fully functional, dynamic blog web application created using Next.js 14, MongoDB, and Tailwind CSS. The project was developed as a comprehensive learning experience to master backend development concepts and transition from React.js to Next.js. The application features a complete REST API, CRUD operations, user authentication and authorization, password hashing, and secure handling of sensitive data.

## Key Features

- **Fullstack Framework**: Built with Next.js 14, integrating both frontend and backend in a single project.
- **Database**: Utilizes MongoDB for data storage and retrieval.
- **Styling**: Tailwind CSS for rapid UI development and responsive design.
- **REST API**: Comprehensive API implementation using Next.js API routes.
- **Authentication and Authorization**: Secure user authentication using JSON Web Tokens (JWT).
- **Password Security**: Passwords hashed using bcryptjs for enhanced security.
- **Image Handling**: Efficient image storage using Cloudinary, with URLs stored in MongoDB.
- **Environment Variables**: Sensitive data management using dotenv.

## Learning Experience

This project was a significant learning experience that included overcoming several challenges:

- **Image Storage**: Initially stored images in MongoDB, which proved inefficient. Researched and implemented Cloudinary for image storage and managed URLs in MongoDB.
- **CRUD Operations**: Implemented full CRUD functionality using HTTP GET, POST, PATCH, and DELETE requests.
- **Authentication and Authorization**: Integrated JWT for secure user authentication and authorization.
- **Password Hashing**: Used bcryptjs to hash passwords, enhancing security.
- **Environment Variables**: Managed sensitive data using dotenv to protect API keys and secrets.

## Usage

- **Sign Up and Login**: 
  - Users can sign up for an account using their email and a password.
  - Log in to access personalized features.
- **Profile Management**:
  - Create a user profile upon signing up.
  - Update profile information such as username and profile picture.
- **Blog Management**:
  - Create new blog posts with titles, content, category and images.
  - Edit or delete your own blog posts.
- **Reading Blogs**:
  - Browse and read blog posts created by other users.
  - Only the author of a blog post can edit or delete it.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have suggestions for improvements.

## Contact

For any questions or feedback, please reach out to me at [ridoymondol140@gmail.com](mailto:ridoymondol140@gmail.com).

---

Thank you for checking out my project! I hope you find it as exciting and informative as I did while building it.
