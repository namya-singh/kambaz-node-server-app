// import express from "express";
// import Hello from "./Hello.js";
// import Lab5 from "./Lab5/index.js";
// import cors from "cors";
// import session from "express-session";
// import "dotenv/config";
//
// import UserRoutes from "./Kambaz/Users/routes.js";
// import CourseRoutes from "./Kambaz/Courses/routes.js";
// import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
// import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
// import ModuleRoutes from "./Kambaz/Modules/routes.js";
//
// const app = express();
//
// // ✅ Define CORS origin whitelist
// const allowedOrigins = [
//     "http://localhost:5173",
//     process.env.NETLIFY_URL || "https://kambazz.netlify.app"
// ];
//
// // ✅ Use CORS middleware
// app.use(cors({
//                  credentials: true,
//                  origin: function (origin, callback) {
//                      if (!origin) return callback(null, true); // Allow tools like Postman
//                      if (allowedOrigins.includes(origin)) return callback(null, true);
//                      return callback(new Error(`CORS error: Origin ${origin} not allowed.`), false);
//                  }
//              }));
//
// // ✅ Express session configuration
// const sessionOptions = {
//     secret: process.env.SESSION_SECRET || "kambaz",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 // 1 day
//     }
// };
//
// // ✅ Adjust cookie options for dev vs production
// if (process.env.NODE_ENV === "production") {
//     sessionOptions.proxy = true; // trust Render/Netlify proxy
//     sessionOptions.cookie.secure = true;
//     sessionOptions.cookie.sameSite = "none";
//     // Optional: set cookie domain if needed
//     // sessionOptions.cookie.domain = "yourdomain.com";
// } else {
//     sessionOptions.cookie.secure = false;
//     sessionOptions.cookie.sameSite = "lax";
// }
//
// // ✅ Apply session middleware
// app.use(session(sessionOptions));
//
// // ✅ JSON body parser
// app.use(express.json());
//
// // ✅ Routes
// UserRoutes(app);
// CourseRoutes(app);
// ModuleRoutes(app);
// AssignmentRoutes(app);
// EnrollmentRoutes(app);
// Lab5(app);
// Hello(app);
//
// // ✅ Start server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

//
// import express from "express";
// import Hello from "./Hello.js";
// import Lab5 from "./Lab5/index.js";
// import cors from "cors";
// import session from "express-session";
// import "dotenv/config";
//
// import UserRoutes from "./Kambaz/Users/routes.js";
// import CourseRoutes from "./Kambaz/Courses/routes.js";
// import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
// import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
// import ModuleRoutes from "./Kambaz/Modules/routes.js";
//
// const app = express();
//
// // ✅ Define CORS origin whitelist
// const allowedOrigins = [
//     "http://localhost:5173",
//     "https://kambazz.netlify.app"
// ];
//
// // ✅ Use CORS middleware
// app.use(cors({
//                  credentials: true,
//                  origin: function (origin, callback) {
//                      if (!origin) return callback(null, true); // Allow tools like Postman or direct calls with no origin
//                      if (allowedOrigins.includes(origin)) return callback(null, true);
//                      return callback(new Error(`CORS error: Origin ${origin} not allowed.`), false);
//                  }
//              }));
//
// // ✅ Express session configuration
// const sessionOptions = {
//     secret: process.env.SESSION_SECRET || "kambaz",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 // 1 day
//     }
// };
//
// // ✅ Adjust cookie options for dev vs production
// if (process.env.NODE_ENV === "production") {
//     app.set('trust proxy', 1); // Trust first proxy in production (Netlify/Render)
//     sessionOptions.proxy = true;
//     sessionOptions.cookie.secure = true;     // HTTPS only
//     sessionOptions.cookie.sameSite = "none"; // Required for cross-site cookies
// } else {
//     sessionOptions.cookie.secure = false;
//     sessionOptions.cookie.sameSite = "lax";  // Safe for localhost development
// }
//
// // ✅ Apply session middleware
// app.use(session(sessionOptions));
//
// // ✅ JSON body parser
// app.use(express.json());
//
// // ✅ Profile route for checking logged-in user session
// app.get('/api/profile', (req, res) => {
//     if (req.session?.user) {
//         res.json(req.session.user);
//     } else {
//         res.status(401).json({ message: "Not authenticated" });
//     }
// });
//
// // ✅ Routes
// UserRoutes(app);
// CourseRoutes(app);
// ModuleRoutes(app);
// AssignmentRoutes(app);
// EnrollmentRoutes(app);
// Lab5(app);
// Hello(app);
//
// // ✅ Start server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';

import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModuleRoutes from './Kambaz/Modules/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';

const app = express();

// ——————————————
// 1) CORS
// ——————————————
const allowedOrigins = [
    'http://localhost:5173',
    process.env.NETLIFY_URL,
];

app.use(
    cors({
             origin: (origin, callback) => {
                 if (!origin) return callback(null, true);
                 if (allowedOrigins.includes(origin)) return callback(null, true);
                 callback(new Error(`CORS policy: origin ${origin} not allowed`));
             },
             credentials: true,
         })
);

// ——————————————
// 2) SESSION
// ——————————————
const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'kambaz',
    resave: false,
    saveUninitialized: false,
};
    if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };

}

app.set('trust proxy', 1);  // even in development — enables secure cookies
app.use(session(sessionOptions));

// ——————————————
// 3) ROUTES & STARTUP
// ——————————————
app.use(express.json());

UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);
AssignmentRoutes(app);
Lab5(app);
Hello(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Debug route to inspect cookie/session
app.post('/api/debug', (req, res) => {
    console.log('🔐 Cookie:', req.headers.cookie);
    console.log('🧠 Session:', req.session);
    res.json({
                 cookie: req.headers.cookie,
                 session: req.session,
                 currentUser: req.session.currentUser || null
             });
});
