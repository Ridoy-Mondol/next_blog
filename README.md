# Fullstack Dynamic Blog Application

## Overview

This is a fully functional, dynamic blog application created using Next.js 14, MongoDB, CSS3, and Tailwind CSS. The project was developed as a comprehensive learning experience to master backend development concepts and transition from React.js to Next.js. The application features a complete REST API, CRUD operations, user authentication and authorization, password hashing, and secure handling of sensitive data, along with Redis caching, Google authentication using NextAuth, email verification, password reset functionality, and a rich text editor for enhanced blog writing.

## Key Features

- **Fullstack Framework**: Built with Next.js 14, integrating both frontend and backend in a single project.
- **Database**: Utilizes MongoDB for data storage and retrieval.
- **Styling**: Combines Tailwind CSS with custom CSS3 for a visually appealing and responsive UI.
- **REST API**: Comprehensive API implementation using Next.js API routes.
- **Authentication and Authorization**: Secure user authentication using JSON Web Tokens (JWT).
- **NextAuth**: Integrated Google authentication using NextAuth for a seamless login experience.
- **Password Security**: Passwords hashed using bcryptjs for enhanced security. Password reset functionality with email verification.
- **Image Handling**: Efficient image storage using Cloudinary, with URLs stored in MongoDB.
- **Caching**: Implemented Redis caching for optimized performance.
- **Rich Text Editor**: Enhanced blog writing experience with a rich text editor.

## Learning Experience

This project presented numerous learning opportunities and challenges:

- **CRUD Operations**: Implemented full CRUD functionality to manage blog posts, enabling users to create, read, update, and delete their content.
- **NextAuth Integration**: Integrated NextAuth with Google provider for seamless authentication and improved user experience.
- **JWT Authentication and Authorization**: Implemented secure user authentication and authorization using JSON Web Tokens (JWT) to protect routes and resources.
- **Email Verification**: Implemented email verification by sending a 6-digit code upon signup, enhancing security and user validation.
- **Password Reset Functionality**: Added password reset functionality by sending a verification code via email, ensuring a smooth user experience.
- **Redis Caching**: Utilized Redis for caching to optimize performance and reduce database load.
- **Enhanced UI with CSS3**: Combined Tailwind CSS with custom CSS3 for a visually appealing and responsive user interface.
- **Rich Text Editing**: Implemented a rich text editor to empower users to create engaging blog content.

## Usage

- **Sign Up and Login**:
  - Users can sign up for an account using their email and a password. Email verification ensures the authenticity of user accounts.
  - Log in using Google for a seamless authentication experience.
- **Password Reset**:
  - Users can reset their password by requesting a verification code via email.
- **Profile Management**:
  - Create a user profile upon signing up.
  - Update profile information such as username and profile picture.
- **Blog Management**:
  - Create new blog posts with titles, content, category, and images using the rich text editor.
  - Edit or delete your own blog posts.
- **Reading Blogs**:
  - Browse and read blog posts created by other users.
  - Only the author of a blog post can edit or delete it.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have suggestions for improvements.

## Contact

For any questions or feedback, please reach out to me at [ridoymondol140@gmail.com](mailto:ridoymondol140@gmail.com).
