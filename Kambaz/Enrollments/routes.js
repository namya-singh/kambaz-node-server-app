// import * as dao from "./dao.js";
//
// export default function EnrollmentRoutes(app) {
//     // Helper to resolve "current" sentinel
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
//     app.get("/api/users/:userId/enrollments", (req, res) => {
//         const uid = resolveUserId(req.params.userId, req.session);
//         if (!uid) return res.sendStatus(401);
//         const list = dao.findEnrollmentsForUser(uid);
//         res.json(list);
//     });
//
//     // POST /api/users/:userId/courses/:courseId  → enroll
//     app.post("/api/users/:userId/courses/:courseId", (req, res) => {
//         const uid = resolveUserId(req.params.userId, req.session);
//         if (!uid) return res.sendStatus(401);
//         const cid = req.params.courseId;
//         if (dao.findEnrollmentByUserCourse(uid, cid)) {
//             return res.status(400).json({ message: "Already enrolled" });
//         }
//         const created = dao.createEnrollment(uid, cid);
//         res.json(created);
//     });
//
//     // DELETE /api/users/:userId/courses/:courseId  → unenroll
//     app.delete("/api/users/:userId/courses/:courseId", (req, res) => {
//         const uid = resolveUserId(req.params.userId, req.session);
//         if (!uid) return res.sendStatus(401);
//         const cid = req.params.courseId;
//         const enroll = dao.findEnrollmentByUserCourse(uid, cid);
//         if (!enroll) return res.sendStatus(404);
//         dao.deleteEnrollmentById(enroll._id);
//         res.sendStatus(204);
//     });
// }



// Kambaz/Enrollments/routes.js

import * as dao from "./dao.js";

import * as courseDao from "../Courses/dao.js";   // ← import to lookup course details

export default function EnrollmentRoutes(app) {

    function resolveUserId(paramUserId, session) {

        if (paramUserId === "current") {

            const cu = session.currentUser;

            if (!cu) return null;

            return cu._id;

        }

        return paramUserId;

    }

    // NEW: return the list of Course objects this user is enrolled in

    app.get("/api/users/:userId/courses", (req, res) => {

        const uid = resolveUserId(req.params.userId, req.session);

        if (!uid) return res.sendStatus(401);

        // get the enrollments, then map to full course data

        const enrollments = dao.findEnrollmentsForUser(uid);

        const courses = enrollments

            .map(e => courseDao.findCourseById(e.course))

            .filter(c => !!c);

        res.json(courses);

    });

    // existing: list raw enrollment records

    app.get("/api/users/:userId/enrollments", (req, res) => {

        const uid = resolveUserId(req.params.userId, req.session);

        if (!uid) return res.sendStatus(401);

        const list = dao.findEnrollmentsForUser(uid);

        res.json(list);

    });

    // enroll in a single course

    app.post("/api/users/:userId/courses/:courseId", (req, res) => {

        const uid = resolveUserId(req.params.userId, req.session);

        if (!uid) return res.sendStatus(401);

        const cid = req.params.courseId;

        // optional: check if already enrolled

        if (dao.findEnrollmentByUserCourse(uid, cid)) {

            return res.sendStatus(409); // conflict

        }

        const created = dao.createEnrollment(uid, cid);

        res.status(201).json(created);

    });

    // unenroll from a course

    app.delete("/api/users/:userId/courses/:courseId", (req, res) => {

        const uid = resolveUserId(req.params.userId, req.session);

        if (!uid) return res.sendStatus(401);

        const cid = req.params.courseId;

        const enroll = dao.findEnrollmentByUserCourse(uid, cid);

        if (!enroll) return res.sendStatus(404);

        dao.deleteEnrollmentById(enroll._id);

        res.sendStatus(204);

    });

}
