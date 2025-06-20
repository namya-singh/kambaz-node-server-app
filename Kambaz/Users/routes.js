







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

            console.log("--- Signin Attempt ---");
            console.log("1. Username received:", username);
            console.log("2. Password received (from frontend): '" + password + "'");
            console.log("3. Password length received:", password ? password.length : 'N/A');

            // --- TEMPORARY DEBUG CODE START ---
            // THESE VARIABLES MUST BE DECLARED
            const testPlainPassword = "test"; // The plain password you created the 'user' with
            const testStoredHash = '$2b$10$5kSBc4xNgTgiRycF7n/ngODrzz7SEr8J9zRdDlgcHl.aY7mcxlv9u'; // The exact hash from your DB for 'user/test'
            console.log("--- DEBUG: Bypassing login logic for direct bcrypt test ---");
            console.log("DEBUG: Test Plain Password (hardcoded): '" + testPlainPassword + "'");
            console.log("DEBUG: Test Stored Hash (hardcoded from DB): '" + testStoredHash + "'");

            try {
                // Test 1: Compare 'test' against the hash from your DB
                const debugMatch1 = await bcrypt.compare(testPlainPassword, testStoredHash);
                console.log("DEBUG: Direct bcrypt.compare('test', stored_hash) result:", debugMatch1);

                // Test 2: Generate a NEW hash for 'test' on the server, then compare 'test' against that new hash
                const newlyHashedTest = await bcrypt.hash(testPlainPassword, 10);
                console.log("DEBUG: Newly generated hash for 'test' (on server): '" + newlyHashedTest + "'");
                const debugMatch2 = await bcrypt.compare(testPlainPassword, newlyHashedTest);
                console.log("DEBUG: Direct bcrypt.compare('test', newly_generated_hash) result:", debugMatch2);

            } catch (debugErr) {
                console.error("DEBUG: Error during direct bcrypt test:", debugErr);
            }
            console.log("--- DEBUG: End of direct bcrypt test ---");
            // --- TEMPORARY DEBUG CODE END ---

            const user = await dao.findUserByUsername(username);

            if (!user) {
                console.log("4. User not found for username:", username);
                return res.status(401).json({ message: "Invalid credentials" });
            }

            console.log("4. User found:", user.username);
            console.log("5. Stored hashed password (from DB): '" + user.password + "'"); // Wrap in quotes
            console.log("6. Stored hashed password length:", user.password ? user.password.length : 'N/A');


            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                console.log("7. Password mismatch for username:", username);
                // This is an advanced debug step, uncomment only if needed and understand the implications
                // try {
                //     const reHashedInput = await bcrypt.hash(password, 10);
                //     console.log("8. Re-hashed input password (for comparison debug):", reHashedInput);
                // } catch (hashError) {
                //     console.error("8. Error re-hashing input for debug:", hashError);
                // }
                return res.status(401).json({ message: "Invalid credentials" });
            }

            req.session.currentUser = user;
            console.log("7. User signed in successfully:", user.username);
            res.json(user);
        } catch (err) {
            console.error("Error during signin:", err);
            res.status(500).json({ error: err.message });
        }
    };

    const profile = (req, res) => {
        console.log("--> Profile route handler reached!");
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
    const findUsersEnrolledInCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            console.log(`Attempting to find users for courseId: ${courseId}`);

            // 1. Find all enrollments for this course
            const enrollments = await enrollmentsDao.findEnrollmentsByCourse(courseId);
            console.log(`Found ${enrollments.length} enrollments for course ${courseId}`);

            // 2. Extract user IDs from enrollments
            const userIds = enrollments.map(enrollment => enrollment.user); // Assuming enrollment has a 'user' field with userId

            // 3. Find user details for these user IDs
            // Note: Mongoose's find({ _id: { $in: array } }) is efficient
            const users = await dao.findUsersByIds(userIds); // You'll need to create this DAO function
            console.log(`Found ${users.length} user details for course ${courseId}`);

            res.json(users);
        } catch (err) {
            console.error(`❌ Error in GET /api/courses/${req.params.courseId}/users:`, err);
            res.status(500).json({ message: err.message });
        }
    };
    app.get("/api/users/profile", (req, res) => {
        const cu = req.session.currentUser;
        if (!cu) {
            return res.status(401).json({ message: "Not signed in" });
        }
        res.json(cu);
    });

    // ... (existing route registrations)

    // --- NEW ROUTE REGISTRATION ---
    app.get("/api/courses/:courseId/users", findUsersEnrolledInCourse); // <--- ADD THIS LINE!


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
    //app.get("/api/users/profile", profile);

    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
}
