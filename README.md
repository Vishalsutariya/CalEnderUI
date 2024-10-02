
# Subscription Calendar App

A web application to manage and visualize your subscriptions using a calendar and charts. Built with **React**, **Material UI**, **Node.js**, **Express**, **MongoDB**, and **Chart.js**.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Google OAuth Authentication**: Secure login using Google accounts.
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices.
- **Calendar View**: Visualize your subscriptions on a monthly calendar.
- **Charts and Graphs**: Interactive charts to analyze subscription expenses over time.
- **Dark Mode and Light Mode**: Toggle between themes based on your preference.
- **Recurring Subscriptions**: Manage ongoing subscriptions with recurrence options.
- **Add/Edit/Delete Subscriptions**: Full CRUD functionality for subscription management.

## Demo

[Watch the video](https://github.com/Vishalsutariya/CalEnderUI/blob/c370ad8f18e352aa2317d35656b9277553efab97/demo/CalEnder_Demo.mp4)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (version 14 or above)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)
- **MongoDB Atlas Account** (for cloud-hosted MongoDB database)
- **Google API Credentials** (for Google OAuth authentication)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Vishalsutariya/CalEnderUI.git
```

### 2. Navigate to the Project Directory

```bash
cd calEnderUI
```

### 3. Install Dependencies

```bash
npm install
```

## Configuration

### 1. Set Up Environment Variables

Create a `.env` file in the root directory of the project:

```bash
touch .env
```

Add the following environment variables to the `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:5001
```

- **REACT_APP_API_BASE_URL**: The URL where your backend server is running.

### 2. Obtain Google API Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** > **OAuth client ID**.
5. Choose **Web application**.
6. Set the **Authorized JavaScript origins** to `http://localhost:3000`.
7. Set the **Authorized redirect URIs** to `http://localhost:3000/auth/google/callback`.
8. After creating, you'll receive a **Client ID** and **Client Secret**.
9. Use the **Client ID** in your `.env` file.

### 3. Set Up the Backend Server

You need the backend server running locally to handle API requests and authentication.

- Clone the backend repository:

  ```bash
  git clone https://github.com/Vishalsutariya/CalEnderBackend.git
  ```

- Follow the setup instructions in the backend repository's README to install dependencies and configure environment variables.

## Running the Application

### 1. Start the Backend Server

Make sure your backend server is running on `http://localhost:5001`.

```bash
# In the CalEnderBackend directory
npm install
npm start
```

### 2. Start the React Application

```bash
npm start
```

This runs the app in development mode.

- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- The page will reload if you make edits.
- You will also see any lint errors in the console.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run eject`

**Note:** This is a one-way operation. Use with caution.

## Project Structure

```
subscription-frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── AddSubscriptionModal.js
│   │   ├── Calendar.js
│   │   ├── Charts.js
│   │   ├── Header.js
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── ColorModeContext.js
│   ├── App.js
│   ├── index.js
│   ├── theme.js
│   └── ...
├── .env
├── package.json
├── README.md
└── ...
```

## Dependencies

Key dependencies used in this project:

- **React**: Frontend library for building user interfaces.
- **Material UI (MUI)**: UI component library for React.
- **Axios**: Promise-based HTTP client for making API requests.
- **React Router**: Routing library for React applications.
- **Chart.js** and **react-chartjs-2**: Libraries for creating charts and graphs.
- **date-fns**: Modern JavaScript date utility library.
- **@mui/icons-material**: Material Design icons for React.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**:

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**.

## License

This project is licensed under the MIT License.

---

If you have any questions or need further assistance, feel free to open an issue or contact the repository owner.

---

**Note:** Replace placeholder URLs, usernames, and other placeholders with actual information relevant to your project.

---

Let me know if you need any modifications or additional information in the README!
