// // import * as dao from "./dao.js";
// //
// // export default function EnrollmentRoutes(app) {
// //     // Helper to resolve "current" sentinel
// //     function resolveUserId(paramUserId, session) {
// //         if (paramUserId === "current") {
// //             const cu = session.currentUser;
// //             if (!cu) return null;
// //             return cu._id;
// //         }
// //         return paramUserId;
// //     }
// //
// //     // GET /api/users/:userId/enrollments
// //     app.get("/api/users/:userId/enrollments", (req, res) => {
// //         const uid = resolveUserId(req.params.userId, req.session);
// //         if (!uid) return res.sendStatus(401);
// //         const list = dao.findEnrollmentsForUser(uid);
// //         res.json(list);
// //     });
// //
// //     // POST /api/users/:userId/courses/:courseId  → enroll
// //     app.post("/api/users/:userId/courses/:courseId", (req, res) => {
// //         const uid = resolveUserId(req.params.userId, req.session);
// //         if (!uid) return res.sendStatus(401);
// //         const cid = req.params.courseId;
// //         if (dao.findEnrollmentByUserCourse(uid, cid)) {
// //             return res.status(400).json({ message: "Already enrolled" });
// //         }
// //         const created = dao.createEnrollment(uid, cid);
// //         res.json(created);
// //     });
// //
// //     // DELETE /api/users/:userId/courses/:courseId  → unenroll
// //     app.delete("/api/users/:userId/courses/:courseId", (req, res) => {
// //         const uid = resolveUserId(req.params.userId, req.session);
// //         if (!uid) return res.sendStatus(401);
// //         const cid = req.params.courseId;
// //         const enroll = dao.findEnrollmentByUserCourse(uid, cid);
// //         if (!enroll) return res.sendStatus(404);
// //         dao.deleteEnrollmentById(enroll._id);
// //         res.sendStatus(204);
// //     });
// // }
// //
//
// //
// // // Kambaz/Enrollments/routes.js
// //
// // import * as dao from "./dao.js";
// //
// // import * as courseDao from "../Courses/dao.js";   // ← import to lookup course details
// //
// // export default function EnrollmentRoutes(app) {
// //
// //     function resolveUserId(paramUserId, session) {
// //
// //         if (paramUserId === "current") {
// //
// //             const cu = session.currentUser;
// //
// //             if (!cu) return null;
// //
// //             return cu._id;
// //
// //         }
// //
// //         return paramUserId;
// //
// //     }
// //
// //     // NEW: return the list of Course objects this user is enrolled in
// //
// //     app.get("/api/users/:userId/courses", (req, res) => {
// //
// //         const uid = resolveUserId(req.params.userId, req.session);
// //
// //         if (!uid) return res.sendStatus(401);
// //
// //         // get the enrollments, then map to full course data
// //
// //         const enrollments = dao.findEnrollmentsForUser(uid);
// //
// //         const courses = enrollments
// //
// //             .map(e => courseDao.findCourseById(e.course))
// //
// //             .filter(c => !!c);
// //
// //         res.json(courses);
// //
// //     });
// //
// //     // existing: list raw enrollment records
// //
// //     app.get("/api/users/:userId/enrollments", (req, res) => {
// //
// //         const uid = resolveUserId(req.params.userId, req.session);
// //
// //         if (!uid) return res.sendStatus(401);
// //
// //         const list = dao.findEnrollmentsForUser(uid);
// //
// //         res.json(list);
// //
// //     });
// //
// //     // enroll in a single course
// //
// //     app.post("/api/users/:userId/courses/:courseId", (req, res) => {
// //
// //         const uid = resolveUserId(req.params.userId, req.session);
// //
// //         if (!uid) return res.sendStatus(401);
// //
// //         const cid = req.params.courseId;
// //
// //         // optional: check if already enrolled
// //
// //         if (dao.findEnrollmentByUserCourse(uid, cid)) {
// //
// //             return res.sendStatus(409); // conflict
// //
// //         }
// //
// //         const created = dao.createEnrollment(uid, cid);
// //
// //         res.status(201).json(created);
// //
// //     });
// //
// //     // unenroll from a course
// //
// //     app.delete("/api/users/:userId/courses/:courseId", (req, res) => {
// //
// //         const uid = resolveUserId(req.params.userId, req.session);
// //
// //         if (!uid) return res.sendStatus(401);
// //
// //         const cid = req.params.courseId;
// //
// //         const enroll = dao.findEnrollmentByUserCourse(uid, cid);
// //
// //         if (!enroll) return res.sendStatus(404);
// //
// //         dao.deleteEnrollmentById(enroll._id);
// //
// //         res.sendStatus(204);
// //
// //     });
// //
// // }
//
//
// import * as dao from "./dao.js";
//
// export default function EnrollmentRoutes(app) {
//     // Helper to resolve "current" sentinel user id
//     function resolveUserId(paramUserId, session) {
//         if (paramUserId === "current") {
//             const cu = session.currentUser;
//             if (!cu) return null;
//             return cu._id;
//         }
//         return paramUserId;
//     }
//
//     // GET /api/users/:userId/enrollments
//     app.get("/api/users/:userId/enrollments", async (req, res) => {
//         const uid = resolveUserId(req.params.userId, req.session);
//         if (!uid) return res.sendStatus(401);
//
//         try {
//             const list = await dao.findEnrollmentsForUser(uid);
//             res.json(list);
//         } catch (error) {
//             console.error("Error fetching enrollments:", error);
//             res.status(500).json({ error: "Failed to fetch enrollments" });
//         }
//     });
//
//     // POST /api/users/:userId/courses/:courseId  → enroll
//     app.post("/api/users/:userId/courses/:courseId", async (req, res) => {
//         const uid = resolveUserId(req.params.userId, req.session);
//         if (!uid) return res.sendStatus(401);
//
//         const cid = req.params.courseId;
//
//         try {
//             const existing = await dao.findEnrollmentByUserCourse(uid, cid);
//             if (existing) {
//                 return res.status(409).json({ message: "Already enrolled" });
//             }
//             const created = await dao.createEnrollment(uid, cid);
//             res.status(201).json(created);
//         } catch (error) {
//             console.error("Error enrolling user:", error);
//             res.status(500).json({ error: "Failed to enroll user" });
//         }
//     });
//
//     // DELETE /api/users/:userId/courses/:courseId  → unenroll
//     app.delete("/api/users/:userId/courses/:courseId", async (req, res) => {
//         const uid = resolveUserId(req.params.userId, req.session);
//         if (!uid) return res.sendStatus(401);
//
//         const cid = req.params.courseId;
//
//         try {
//             const enroll = await dao.findEnrollmentByUserCourse(uid, cid);
//             if (!enroll) return res.sendStatus(404);
//
//             await dao.deleteEnrollmentById(enroll._id);
//             res.sendStatus(204);
//         } catch (error) {
//             console.error("Error unenrolling user:", error);
//             res.status(500).json({ error: "Failed to unenroll user" });
//         }
//     });
// }
//
//
//
//
//




import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    function resolveUserId(param, session) {
        if (param === "current") {
            const cu = session.currentUser;
            return cu?._id ?? null;
        }
        return param;
    }

    app.get("/api/users/:userId/enrollments", async (req, res) => {
        const uid = resolveUserId(req.params.userId, req.session);
        if (!uid) return res.sendStatus(401);
        const list = await dao.findEnrollmentsForUser(uid);
        res.json(list);
    });

    app.get("/api/users/:userId/courses", async (req, res) => {
        const uid = resolveUserId(req.params.userId, req.session);
        if (!uid) return res.sendStatus(401);
        const courses = await dao.findCoursesForUser(uid);
        res.json(courses);
    });

    app.post("/api/users/:userId/courses/:courseId", async (req, res) => {
        const uid = resolveUserId(req.params.userId, req.session);
        if (!uid) return res.sendStatus(401);
        const cid = req.params.courseId;
        const existing = await dao.findEnrollmentsForUser(uid)
            .then(list => list.find(e => e.course === cid));
        if (existing) return res.sendStatus(409);
        const created = await dao.enrollUserInCourse(uid, cid);
        res.status(201).json(created);
    });

    app.delete("/api/users/:userId/courses/:courseId", async (req, res) => {
        const uid = resolveUserId(req.params.userId, req.session);
        if (!uid) return res.sendStatus(401);
        const cid = req.params.courseId;
        await dao.unenrollUserFromCourse(uid, cid);
        res.sendStatus(204);
    });

    app.get("/api/courses/:courseId/enrollments", async (req, res) => {
        const list = await dao.findEnrollmentsForCourse(req.params.courseId);
        res.json(list);
    });
}