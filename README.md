# AUST CP Standings - Frontend

Frontend for the AUST Competitive Programming Standings app built with **React + Vite**.

---

## 🚀 Tech Stack

- React (via Vite)
- React Router DOM
- Axios
- HTML2Canvas
- PapaParse, XLSX
- Deployed on Vercel

---

## 📁 Project Structure

```
aust-cp-frontend/
├── public/                   # Static assets
│   ├── assets/               # Logos, images, etc.
├── src/
│   ├── components/           # Reusable components (e.g., Navbar, Announcements)
│   ├── pages/                # Page-level components (Home, Contact, Standings)
│   ├── styles/               # CSS files (modularized or global)
│   ├── utils.js              # API and export helpers
│   ├── App.jsx               # Main App entry
│   └── main.jsx              # Vite's bootstrap file
├── .env                      # Frontend environment variables
├── .gitignore                # Git ignored files
├── index.html                # Main HTML template
├── package.json              # Project metadata and scripts
└── README.md                 # This file
```

---

## ⚙️ Setup Instructions

### 1. Clone the frontend repo

```bash
git clone https://github.com/YOUR_USERNAME/aust-cp-frontend.git
cd aust-cp-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```bash
touch .env
```

create your backend, host it and add this line to it:

```env
VITE_API_URL=https://your-backend-url.com
```

### 4. Run development server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) by default.

---

## 🌐 Deployment

### Vercel

1. Push this frontend to GitHub.
2. Go to [vercel.com](https://vercel.com/).
3. Import GitHub project.
4. During setup, add the `VITE_API_URL` environment variable.
5. Deploy and done 🎉

---

## 📬 Contact

For feedback, open an issue or email [apuorgho7@gmail.com](mailto:apuorgho7@gmail.com).
