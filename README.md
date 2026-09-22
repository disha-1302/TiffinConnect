# 🍱 TiffinConnect - Campus Meal Aggregator

An AI-powered, Full-Stack meal subscription platform exclusively designed for the IIITDM Jabalpur campus. It bridges the gap between students and local tiffin centers (like Khamaria vendors) with smart tools and real-time order tracking.

## ✨ Key Features

### 👨‍🎓 For Students
*   **Live Menu Tracking:** View today's menus from various local vendors.
*   **✨ AI Nutrition Analyzer:** Powered by Gemini AI, instantly get estimated Calories, Protein, and Carbs for any meal.
*   **Order Management:** Place orders specific to hostel blocks (e.g., Hall 1, Hall 4) and track live statuses.

### 🧑‍🍳 For Vendors
*   **Menu Management:** Easily publish and update daily meals and cut-off times.
*   **✨ AI Menu Enhancer:** Convert simple meal inputs into mouth-watering, punchy descriptions using Gemini AI copywriting.
*   **Dashboard & Analytics:** Track active orders, aggregate tiffin counts by hostel, and update delivery statuses (Placed -> Preparing -> Delivered).

### 🛡️ Admin
*   **God Mode Dashboard:** Secure PIN-based access to view all registered students, active vendors, and overall order logs.

## 🛠️ Tech Stack
*   **Frontend:** React.js, Vite
*   **Styling:** Tailwind CSS (v4.0)
*   **Database/State:** Mock Firebase (Local Storage based for zero-setup testing)
*   **AI Integration:** Google Gemini 1.5 Flash API

## 🚀 Local Development Setup

To run this project locally on your machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mayank-7405/tiffin-connect.git
    cd tiffin-connect
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173/` in your browser.

## 🔑 Demo Credentials (Quick Test)
No need to sign up! Use these hardcoded demo accounts to test the features instantly:

*   **Student Demo:** Phone: `8888888888` | Pass: `123`
*   **Vendor Demo:** Phone: `9999999999` | Pass: `123`
*   **Admin Panel PIN:** `132006`

## 📁 Architecture
This project follows a scalable, modular architecture separating UI components, page views, and backend services.