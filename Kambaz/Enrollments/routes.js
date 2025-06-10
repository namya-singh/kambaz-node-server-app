import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    // Helper to resolve "current" sentinel
    function resolveUserId(paramUserId, session) {
        if (paramUserId === "current") {
            const cu = session.currentUser;
            if (!cu) return null;
            return cu._id;
        }
        return paramUserId;
    }

    // GET /api/users/:userId/enrollments
    app.get("/api/users/:userId/enrollments", (req, res) => {
        const uid = resolveUserId(req.params.userId, req.session);
        if (!uid) return res.sendStatus(401);
        const list = dao.findEnrollmentsForUser(uid);
        res.json(list);
    });

    // POST /api/users/:userId/courses/:courseId  → enroll
    app.post("/api/users/:userId/courses/:courseId", (req, res) => {
        const uid = resolveUserId(req.params.userId, req.session);
        if (!uid) return res.sendStatus(401);
        const cid = req.params.courseId;
        if (dao.findEnrollmentByUserCourse(uid, cid)) {
            return res.status(400).json({ message: "Already enrolled" });
        }
        const created = dao.createEnrollment(uid, cid);
        res.json(created);
    });

    // DELETE /api/users/:userId/courses/:courseId  → unenroll
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