// import * as dao from "./dao.js";
// import * as enrollmentsDao from "../Enrollments/dao.js";
// import * as courseDao from "../Courses/dao.js";
// let currentUser = null;
//
// export default function UserRoutes(app) {
//     const createCourse = (req, res) => {
//         const currentUser = req.session["currentUser"];
//         const newCourse = courseDao.createCourse(req.body);
//         enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
//         res.json(newCourse);
//     };
//     app.post("/api/users/current/courses", createCourse);
//
//     const createUser = async (req, res) => {
//         const user = await dao.createUser(req.body);
//         res.json(user);
//     };
//
//     const deleteUser = async (req, res) => {
//         const status = await dao.deleteUser(req.params.userId);
//         res.json(status);
//
//     };
//     const findAllUsers = async (req, res) => {
//         const { role } = req.query;
//         if (role) {
//             const users = await dao.findUsersByRole(role);
//             res.json(users);
//             return;
//         }
//         const users = await dao.findAllUsers();
//         res.json(users);
//     };
//
//     const findUserById = async (req, res) => {
//
//         const user = await dao.findUserById(req.params.userId);
//         res.json(user);
//
//     };
//     const updateUser = async (req, res) => {
//         const userId = req.params.userId;
//         const userUpdates = req.body;
//
//         await dao.updateUser(userId, userUpdates);
//
//         const currentUser = req.session["currentUser"];
//         if (currentUser && currentUser._id === userId) {
//             req.session["currentUser"] = { ...currentUser, ...userUpdates };
//         }
//
//         const updatedUser = await dao.findUserById(userId);
//         res.json(updatedUser);
//     };
//
//     const signup = async (req, res) => {const user =  await dao.findUserByUsername(req.body.username);
//         if (user) {
//             res.status(400).json(
//                 { message: "Username already in use" });
//             return;
//         }
//         const currentUser = await dao.createUser(req.body);
//         req.session["currentUser"] = currentUser;
//
//         res.json(currentUser);
//     };
//     const signin = async (req, res) => {  const { username, password } = req.body;
//         const currentUser =  await dao.findUserByCredentials(username, password);
//         if (currentUser) {
//             req.session["currentUser"] = currentUser;
//             res.json(currentUser);
//         } else {
//             res.status(401).json({ message: "Unable to login. Try again later." });
//         }
//
//     };
//
//
//
//     const signout = (req, res) => {
//         req.session.destroy();
//         res.sendStatus(200);
//
//     };
//     const profile = (req, res) => {
//         const currentUser = req.session["currentUser"];
//         if (!currentUser) {
//             res.sendStatus(401);
//             return;
//         }
//
//         res.json(currentUser);
//     };
//     const findCoursesForUser = async (req, res) => {
//         const currentUser = req.session["currentUser"];
//         if (!currentUser) {
//             res.sendStatus(401);
//             return;
//         }
//         if (currentUser.role === "ADMIN") {
//             const courses = await courseDao.findAllCourses();
//             res.json(courses);
//             return;
//         }
//         let { uid } = req.params;
//         if (uid === "current") {
//             uid = currentUser._id;
//         }
//         const courses = await enrollmentsDao.findCoursesForUser(uid);
//         res.json(courses);
//     };
//     const enrollUserInCourse1 = async (req, res) => {
//         let { uid, cid } = req.params;
//         if (uid === "current") {
//             const currentUser = req.session["currentUser"];
//             uid = currentUser._id;
//         }
//         const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
//         res.send(status);
//     };
//     const unenrollUserFromCourse1 = async (req, res) => {
//         let { uid, cid } = req.params;
//         if (uid === "current") {
//             const currentUser = req.session["currentUser"];
//             uid = currentUser._id;
//         }
//         const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
//         res.send(status);
//     };
//     app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
//     app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
//
//     app.get("/api/users/:uid/courses", findCoursesForUser);
//
//
//     app.post("/api/users", createUser);
//     app.get("/api/users", findAllUsers);
//     app.get("/api/users/:userId", findUserById);
//     app.put("/api/users/:userId", updateUser);
//     app.delete("/api/users/:userId", deleteUser);
//     app.post("/api/users/signup", signup);
//     app.post("/api/users/signin", signin);
//     app.post("/api/users/signout", signout);
//     app.post("/api/users/profile", profile);
//     app.get("/api/users", findAllUsers);
//
// }


//
// import * as dao            from "./dao.js";
// import * as courseDao      from "../Courses/dao.js";
// import * as enrollmentsDao from "../Enrollments/dao.js";
// import { v4 as uuidv4 } from 'uuid';
//
//
// export default function UserRoutes(app) {
//     const createCourse = async (req, res) => {
//         const cu = req.session.currentUser;
//         if (!cu) return res.sendStatus(401);
//
//         const newCourse = await courseDao.createCourse(req.body);
//
//         await enrollmentsDao.enrollUserInCourse(cu._id, newCourse._id);
//
//         res.json(newCourse);
//     };
//
//     const createUser   = async (req, res) => {
//         try {
//             const u = await dao.createUser(req.body);
//             res.status(201).json(u);
//         } catch (err) {
//             res.status(400).json({ error: err.message });
//         }
//     };
//     const findAllUsers = async (req, res) => {
//         const { name, role } = req.query;
//         try {
//             let users;
//             if (name) {
//                 users = await dao.findUsersByPartialName(name);
//             } else if (role) {
//                 users = await dao.findUsersByRole(role);
//             } else {
//                 users = await dao.findAllUsers();
//             }
//             return res.json(users);
//         } catch (err) {
//             console.error("❌ Error in GET /api/users:", err);
//             return res.status(500).json({ message: err.message });
//         }
//     };
//
//     const findUserById = async (req, res) => {
//         try {
//             const u = await dao.findUserById(req.params.userId);
//             if (!u) return res.sendStatus(404);
//             res.json(u);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     const updateUser = async (req, res) => {
//         try {
//             const updates = { ...req.body };
//             delete updates._id;
//             if (typeof updates.dob === "string") {
//                 updates.dob = new Date(updates.dob);
//             }
//             const updated = await dao.updateUser(req.params.userId, updates);
//             if (!updated) return res.sendStatus(404);
//             if (
//                 req.session.currentUser &&
//                 req.session.currentUser._id === updated._id.toString()
//             ) {
//                 req.session.currentUser = updated;
//             }
//             res.json(updated);
//         } catch (err) {
//             console.error("Profile update failed:", err);
//             res.status(400).json({ message: err.message });
//         }
//     };
//     const updateUserHandler = async (req, res) => {
//         try {
//             const userId = req.params.userId;
//             const updates = { ...req.body };
//             delete updates._id;
//
//             // Convert dob string to Date if needed
//             if (typeof updates.dob === "string") {
//                 updates.dob = new Date(updates.dob);
//             }
//
//             const updated = await dao.updateUser(userId, updates);
//             if (!updated) return res.sendStatus(404);
//
//             // Sync session if current user updated themselves
//             if (req.session.currentUser && req.session.currentUser._id === updated._id.toString()) {
//                 req.session.currentUser = updated;
//             }
//
//             res.json(updated);
//         } catch (err) {
//             console.error("Profile update failed:", err);
//             res.status(400).json({ message: err.message });
//         }
//     };
//
// // Register this once
//     app.put("/api/users/:userId", updateUserHandler);
//
//
//     const deleteUser = async (req, res) => {
//         try {
//             await dao.deleteUser(req.params.userId);
//             res.sendStatus(204);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     const signup = async (req, res) => {
//         try {
//             const exists = await dao.findUserByUsername(req.body.username);
//             if (exists) return res.status(400).json({ message: "Username already in use" });
//             const newUser = await dao.createUser(req.body);
//             req.session.currentUser = newUser;
//             res.status(201).json(newUser);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     const signin = async (req, res) => {
//         try {
//             const { username, password } = req.body;
//             const user = await dao.findUserByCredentials(username, password);
//             if (!user) return res.status(401).json({ message: "Invalid credentials" });
//             req.session.currentUser = user;
//             res.json(user);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     const profile = (req, res) => {
//         const cu = req.session.currentUser;
//         if (!cu) return res.json(null);
//         res.json(cu);
//     };
//
//     const signout = (req, res) => {
//         req.session.destroy(err => {
//             if (err) return res.status(500).json({ error: err.message });
//             res.clearCookie("connect.sid");
//             res.sendStatus(204);
//         });
//     };
//     // app.put("/api/users/:userId", async (req, res) => {
//     //     const { userId }   = req.params;
//     //     const userUpdates  = req.body;
//     //     await dao.updateUser(userId, userUpdates);
//     //     if (req.session.currentUser?._id === userId) {
//     //         req.session.currentUser = { ...req.session.currentUser, ...userUpdates };
//     //     }
//     //     res.json(req.session.currentUser);
//     // });
//     app.put("/api/users/:userId", async (req, res) => {
//         const { userId } = req.params;
//         const userUpdates = req.body;
//         await dao.updateUser(userId, userUpdates);
//         if (req.session.currentUser?._id === userId) {
//             req.session.currentUser = { ...req.session.currentUser, ...userUpdates };
//         }
//         res.json(req.session.currentUser);
//     });
//
//
//     const findCoursesForEnrolledUser = async (req, res) => {
//         try {
//             let { userId } = req.params;
//             if (userId === "current") {
//                 const u = req.session.currentUser;
//                 if (!u) return res.sendStatus(401);
//                 userId = u._id;
//             }
//             const courses = await courseDao.findCoursesForEnrolledUser(userId);
//             res.json(courses);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//     const createUserHandler = async (req, res) => {
//         try {
//             const user = await dao.createUser(req.body);
//             res.json(user);
//         } catch (err) {
//             console.error("Error creating user:", err);
//             res.status(500).json({ message: err.message });
//         }
//     };
//     app.get    ("/api/users/profile",         profile);
//
//     app.post   ("/api/users/current/courses", createCourse);
//     app.get    ("/api/users/:userId/courses", findCoursesForEnrolledUser);
//
//     //app.post   ("/api/users",                 createUser);
//     app.get    ("/api/users",                 findAllUsers);
//     app.get    ("/api/users/:userId",         findUserById);
//     app.put    ("/api/users/:userId",         updateUser);
//     app.delete ("/api/users/:userId",         deleteUser);
//     app.post("/api/users", createUserHandler);
//     app.post   ("/api/users/signup",          signup);
//     app.post   ("/api/users/signin",          signin);
//     app.post   ("/api/users/signout",         signout);
//
// }










//
// import * as dao            from "./dao.js";
// import * as courseDao      from "../Courses/dao.js";
// import * as enrollmentsDao from "../Enrollments/dao.js";
//
// export default function UserRoutes(app) {
//     const createCourse = async (req, res) => {
//         const cu = req.session.currentUser;
//         if (!cu) return res.sendStatus(401);
//
//         const newCourse = await courseDao.createCourse(req.body);
//         await enrollmentsDao.enrollUserInCourse(cu._id, newCourse._id);
//         res.json(newCourse);
//     };
//
//     const createUserHandler = async (req, res) => {
//         try {
//             const user = await dao.createUser(req.body);
//             res.status(201).json(user);
//         } catch (err) {
//             res.status(400).json({ error: err.message });
//         }
//     };
//
//     const findAllUsers = async (req, res) => {
//         const { name, role } = req.query;
//         try {
//             let users;
//             if (name) {
//                 users = await dao.findUsersByPartialName(name);
//             } else if (role) {
//                 users = await dao.findUsersByRole(role);
//             } else {
//                 users = await dao.findAllUsers();
//             }
//             res.json(users);
//         } catch (err) {
//             console.error("❌ Error in GET /api/users:", err);
//             res.status(500).json({ message: err.message });
//         }
//     };
//
//     const findUserById = async (req, res) => {
//         try {
//             const user = await dao.findUserById(req.params.userId);
//             if (!user) return res.sendStatus(404);
//             res.json(user);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     const updateUser = async (req, res) => {
//         try {
//             const updates = { ...req.body };
//             delete updates._id;
//             if (typeof updates.dob === "string") {
//                 updates.dob = new Date(updates.dob);
//             }
//             const updated = await dao.updateUser(req.params.userId, updates);
//             if (!updated) return res.sendStatus(404);
//
//             if (
//                 req.session.currentUser &&
//                 req.session.currentUser._id === updated._id.toString()
//             ) {
//                 req.session.currentUser = updated;
//             }
//
//             res.json(updated);
//         } catch (err) {
//             console.error("Profile update failed:", err);
//             res.status(400).json({ message: err.message });
//         }
//     };
//
//     const deleteUser = async (req, res) => {
//         try {
//             await dao.deleteUser(req.params.userId);
//             res.sendStatus(204);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     const signup = async (req, res) => {
//         try {
//             const exists = await dao.findUserByUsername(req.body.username);
//             if (exists) return res.status(400).json({ message: "Username already in use" });
//
//             const newUser = await dao.createUser(req.body);
//             req.session.currentUser = newUser;
//             res.status(201).json(newUser);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     const signin = async (req, res) => {
//         try {
//             const { username, password } = req.body;
//             const user = await dao.findUserByCredentials(username, password);
//             if (!user) return res.status(401).json({ message: "Invalid credentials" });
//             req.session.currentUser = user;
//             res.json(user);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     const profile = (req, res) => {
//         const cu = req.session.currentUser;
//         if (!cu) return res.json(null);
//         res.json(cu);
//     };
//
//     const signout = (req, res) => {
//         req.session.destroy(err => {
//             if (err) return res.status(500).json({ error: err.message });
//             res.clearCookie("connect.sid");
//             res.sendStatus(204);
//         });
//     };
//
//     const findCoursesForEnrolledUser = async (req, res) => {
//         try {
//             let { userId } = req.params;
//             if (userId === "current") {
//                 const u = req.session.currentUser;
//                 if (!u) return res.sendStatus(401);
//                 userId = u._id;
//             }
//             const courses = await courseDao.findCoursesForEnrolledUser(userId);
//             res.json(courses);
//         } catch (err) {
//             res.status(500).json({ error: err.message });
//         }
//     };
//
//     // Route registrations
//     app.post("/api/users/current/courses", createCourse);
//
//     app.get("/api/users", findAllUsers);
//     app.get("/api/users/:userId", findUserById);
//     app.put("/api/users/:userId", updateUser);
//     app.delete("/api/users/:userId", deleteUser);
//
//     app.post("/api/users", createUserHandler);
//
//     app.post("/api/users/signup", signup);
//     app.post("/api/users/signin", signin);
//     app.post("/api/users/signout", signout);
//     app.get("/api/users/profile", profile);
//
//     app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
// }







import bcrypt from "bcrypt";
import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createCourse = async (req, res) => {
        const cu = req.session.currentUser;
        if (!cu) return res.sendStatus(401);

        const newCourse = await courseDao.createCourse(req.body);
        await enrollmentsDao.enrollUserInCourse(cu._id, newCourse._id);
        res.json(newCourse);
    };

    const createUserHandler = async (req, res) => {
        try {
            const user = await dao.createUser(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    };

    const findAllUsers = async (req, res) => {
        const { name, role } = req.query;
        try {
            let users;
            if (name) {
                users = await dao.findUsersByPartialName(name);
            } else if (role) {
                users = await dao.findUsersByRole(role);
            } else {
                users = await dao.findAllUsers();
            }
            res.json(users);
        } catch (err) {
            console.error("❌ Error in GET /api/users:", err);
            res.status(500).json({ message: err.message });
        }
    };

    const findUserById = async (req, res) => {
        try {
            const user = await dao.findUserById(req.params.userId);
            if (!user) return res.sendStatus(404);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    const updateUser = async (req, res) => {
        try {
            const updates = { ...req.body };
            delete updates._id;
            if (typeof updates.dob === "string") {
                updates.dob = new Date(updates.dob);
            }
            const updated = await dao.updateUser(req.params.userId, updates);
            if (!updated) return res.sendStatus(404);

            if (
                req.session.currentUser &&
                req.session.currentUser._id === updated._id.toString()
            ) {
                req.session.currentUser = updated;
            }

            res.json(updated);
        } catch (err) {
            console.error("Profile update failed:", err);
            res.status(400).json({ message: err.message });
        }
    };

    const deleteUser = async (req, res) => {
        try {
            await dao.deleteUser(req.params.userId);
            res.sendStatus(204);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    const signup = async (req, res) => {
        try {
            const { username, password, ...rest } = req.body;

            const exists = await dao.findUserByUsername(username);
            if (exists) return res.status(400).json({ message: "Username already in use" });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await dao.createUser({ username, password: hashedPassword, ...rest });

            req.session.currentUser = newUser;
            res.status(201).json(newUser);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log("Attempting signin for username:", username); // Add this
            const user = await dao.findUserByUsername(username);
            if (!user) {
                console.log("User not found for username:", username); // Add this
                return res.status(401).json({ message: "Invalid credentials" });
            }

            console.log("User found:", user.username); // Add this
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                console.log("Password mismatch for username:", username); // Add this
                return res.status(401).json({ message: "Invalid credentials" });
            }

            req.session.currentUser = user;
            console.log("User signed in successfully:", user.username); // Add this
            res.json(user);
        } catch (err) {
            console.error("Error during signin:", err); // Crucial for catching unexpected errors
            res.status(500).json({ error: err.message });
        }
    };

    const profile = (req, res) => {
        const cu = req.session.currentUser;
        if (!cu) return res.json(null);
        res.json(cu);
    };

    const signout = (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).json({ error: err.message });
            res.clearCookie("connect.sid");
            res.sendStatus(204);
        });
    };

    const findCoursesForEnrolledUser = async (req, res) => {
        try {
            let { userId } = req.params;
            if (userId === "current") {
                const u = req.session.currentUser;
                if (!u) return res.sendStatus(401);
                userId = u._id;
            }
            const courses = await courseDao.findCoursesForEnrolledUser(userId);
            res.json(courses);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Route registrations
    app.post("/api/users/current/courses", createCourse);

    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);

    app.post("/api/users", createUserHandler);

    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.get("/api/users/profile", profile);

    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
}
