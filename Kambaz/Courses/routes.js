


//
// import * as dao            from "./dao.js";
// import * as modulesDao     from "../Modules/dao.js";
// import * as enrollmentsDao from "../Enrollments/dao.js";
//
// export default function CourseRoutes(app) {
//     app.post("/api/courses", async (req, res) => {
//         try {
//             const course = await dao.createCourse(req.body);
//             const cu = req.session.currentUser;
//             if (cu) {
//                 await enrollmentsDao.enrollUserInCourse(cu._id, course._id);
//             }
//             res.status(201).json(course);
//         } catch (e) {
//             console.error("POST /api/courses error:", e);
//             res.status(400).json({ message: e.message });
//         }
//     });
//
//     app.get("/api/courses", async (req, res) => {
//         const all = await dao.findAllCourses();
//         res.json(all);
//     });
//
//     app.get("/api/courses/:courseId", async (req, res) => {
//         const c = await dao.findCourseById(req.params.courseId);
//         c ? res.json(c) : res.sendStatus(404);
//     });
//
//     app.delete("/api/courses/:courseId", async (req, res) => {
//         await dao.deleteCourse(req.params.courseId);
//         res.sendStatus(204);
//     });
//
//     app.put("/api/courses/:courseId", async (req, res) => {
//         const updated = await dao.updateCourse(req.params.courseId, req.body);
//         res.json(updated);
//     });
//
//     app.post("/api/courses/:courseId/modules", async (req, res) => {
//         const m = await modulesDao.createModule({ ...req.body, course: req.params.courseId });
//         res.json(m);
//     });
//     app.get("/api/courses/:courseId/users", async (req, res) => {
//         const { courseId } = req.params;
//         try {
//             const users = await enrollmentsDao.findUsersForCourse(courseId);
//             res.json(users);
//         } catch (err) {
//             console.error("GET /api/courses/:courseId/users error:", err);
//             res.status(500).json({ message: err.message });
//         }
//     });
//
//
//     app.get("/api/courses/:cid/users", async (req, res) => {
//         try {
//             const { cid } = req.params;
//             const users = await enrollmentsDao.findUsersForCourse(cid);
//             res.json(users);
//         } catch (e) {
//             console.error("GET /api/courses/:cid/users error:", e);
//             res.status(500).json({ message: e.message });
//         }
//     });
// }



// Updated CourseRoutes (backend)
import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
    app.post("/api/courses", async (req, res) => {
        try {
            const course = await dao.createCourse(req.body);
            const cu = req.session.currentUser;
            if (cu) {
                await enrollmentsDao.enrollUserInCourse(cu._id, course._id);
            }
            res.status(201).json(course);
        } catch (e) {
            console.error("POST /api/courses error:", e);
            res.status(400).json({ message: e.message });
        }
    });

    app.get("/api/courses", async (req, res) => {
        try {
            const cu = req.session.currentUser;
            const courses = await dao.findAllCourses();

            if (!cu) return res.json(courses);

            const enrolledCourses = await enrollmentsDao.findCoursesForUser(cu._id);
            const enrolledIds = new Set(enrolledCourses.map((c) => c._id.toString()));

            const enriched = courses.map((c) => ({
                ...c,
                enrolled: enrolledIds.has(c._id.toString()),
            }));

            res.json(enriched);
        } catch (err) {
            console.error("GET /api/courses error:", err);
            res.status(500).json({ message: err.message });
        }
    });

    app.get("/api/courses/:courseId", async (req, res) => {
        const c = await dao.findCourseById(req.params.courseId);
        c ? res.json(c) : res.sendStatus(404);
    });

    app.delete("/api/courses/:courseId", async (req, res) => {
        await dao.deleteCourse(req.params.courseId);
        res.sendStatus(204);
    });

    app.put("/api/courses/:courseId", async (req, res) => {
        const updated = await dao.updateCourse(req.params.courseId, req.body);
        res.json(updated);
    });

    app.post("/api/courses/:courseId/modules", async (req, res) => {
        const m = await modulesDao.createModule({
                                                    ...req.body,
                                                    course: req.params.courseId,
                                                });
        res.json(m);
    });

    app.get("/api/courses/:courseId/users", async (req, res) => {
        const { courseId } = req.params;
        try {
            const users = await enrollmentsDao.findUsersForCourse(courseId);
            res.json(users);
        } catch (err) {
            console.error("GET /api/courses/:courseId/users error:", err);
            res.status(500).json({ message: err.message });
        }
    });

    app.get("/api/courses/:cid/users", async (req, res) => {
        try {
            const { cid } = req.params;
            const users = await enrollmentsDao.findUsersForCourse(cid);
            res.json(users);
        } catch (e) {
            console.error("GET /api/courses/:cid/users error:", e);
            res.status(500).json({ message: e.message });
        }
    });
}
