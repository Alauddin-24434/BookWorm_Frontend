# 📚 BookWorm - A Premium Book Library Management System

BookWorm is a full-stack book library application where users can manage their personal reading collections, track progress, and share reviews. Built with the **MERN** stack and **Redux Toolkit**, it focuses on a seamless user experience and robust data management.

**Live Link:** [https://bookworm-khaki-mu.vercel.app](https://bookworm-khaki-mu.vercel.app)

---

## 🚀 Key Features

-   **Smart Library Management:** Add books to different shelves: *Want to Read*, *Currently Reading*, and *Read*.
-   **Real-time Progress Tracking:** Users can track their reading journey with visual progress bars.
-   **Review System:** An approved review system where users can share feedback and ratings.
-   **Advanced Debugging:** Robust error handling and CORS-enabled secure API communication.
-   **Responsive UI:** Fully responsive design built with **Tailwind CSS** and **Lucide React** icons.

---

## 🛠️ Tech Stack

### Frontend:
-   **Next.js 16** (App Router)
-   **Redux Toolkit (RTK Query)** for state management and API calls.
-   **Tailwind CSS** for premium styling.
-   **Lucide React** for icons.
-   **React Hot Toast** for instant notifications.

### Backend:
-   **Node.js & Express.js**
-   **MongoDB & Mongoose** (with Transaction support for data integrity).
-   **TypeScript** for type safety.
-   **CORS** & **JWT** for secure communication.

---

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Alauddin-24434/BookWorm_Frontend(https://github.com/Alauddin-24434/BookWorm_Frontend)
    ```

2.  **Install dependencies:**
    ```bash
    # For Frontend
    cd BookWorm_Frontend && npm install

    # For Backend
    cd server && npm install
    ```

3.  **Setup Environment Variables (.env):**
    Create a `.env` file in the server directory:
    ```env
    PORT=5000
    DATABASE_URL=your_mongodb_url
    JWT_ACCESS_SECRET=your_secret
    ```

4.  **Run the application:**
    ```bash
    # Backend
    npm run start:dev

    # Frontend
    npm run dev
    ```

---

## 🐛 Challenges & Debugging (My Strength)

During the development, I focused heavily on solving complex bugs to ensure a smooth user experience. 

-   **CORS Fix:** Solved cross-origin resource sharing issues by specifically white-listing production domains.
-   **Data Integrity:** Implemented **MongoDB Transactions (session)** in the library service to prevent partial data updates during complex operations.
-   **Image Rendering:** Fixed Next.js Image component crashes by implementing a robust fallback mechanism for empty `src` attributes.

---

## 👨‍💻 Author

**[Your Name]**
*Aspiring Associate Web Instructor | Problem Solver | Full Stack Developer*

---