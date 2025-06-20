// import * as dao from "./dao.js";
// import * as courseDao from "../Courses/dao.js";
// import * as modulesDao from "../Modules/dao.js";
// import * as enrollmentsDao from "../Enrollments/dao.js";
//
//
//
// export default function CourseRoutes(app) {
//     const findUsersForCourse = async (req, res) => {
//         const { cid } = req.params;
//         const users = await enrollmentsDao.findUsersForCourse(cid);
//         res.json(users);
//     };
//     app.get("/api/courses/:cid/users", findUsersForCourse);
//
//
//     // // Get all courses
//     app.get("/api/courses", async (req, res) => {
//         const courses = await dao.findAllCourses();
//         res.send(courses);
//     });
//     app.post("/api/courses", async (req, res) => {
//         const course = await dao.createCourse(req.body);
//         const currentUser = req.session["currentUser"];
//         if (currentUser) {
//             await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
//         }
//
//         res.json(course);
//     });
//     // app.post("/api/courses", async (req, res) => {
//     //     const course = await dao.createCourse(req.body);
//     //     const userId = req.body.userId || req.session["currentUser"]?._id;
//     //     if (userId) {
//     //         await enrollmentsDao.enrollUserInCourse(userId, course._id);
//     //     }
//     //     res.json(course);
//     // });
//
//
//     // Delete a course by ID
//     app.delete("/api/courses/:courseId", async (req, res) => {
//         const { courseId } = req.params;
//         const status =  await dao.deleteCourse(courseId);
//         res.send(status);
//     });
//
//     // Get courses for the currently logged-in user (enrolled)
//     const findCoursesForEnrolledUser = (req, res) => {
//         let { userId } = req.params;
//         if (userId === "current") {
//             const currentUser = req.session["currentUser"];
//             if (!currentUser) {
//                 res.sendStatus(401);
//                 return;
//             }
//             userId = currentUser._id;
//         }
//         const courses = courseDao.findCoursesForEnrolledUser(userId);
//         res.json(courses);
//     };
//     app.post("/api/courses/:courseId/modules", async (req, res) => {
//         const { courseId } = req.params;
//         const module = {
//             ...req.body,
//             course: courseId,
//         };
//         const newModule = await modulesDao.createModule(module);
//         res.send(newModule);
//     });
//
//
//     app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
//     app.put("/api/courses/:courseId", async (req, res) => {
//         const { courseId } = req.params;
//         const courseUpdates = req.body;
//         const status = await dao.updateCourse(courseId, courseUpdates);
//         res.send(status);
//     });
//     app.get("/api/courses/:courseId/modules", async (req, res) => {
//         const { courseId } = req.params;
//         const modules = await modulesDao.findModulesForCourse(courseId);
//         res.json(modules);
//     });
//
//
//
//
// }




import * as dao            from "./dao.js";
import * as modulesDao     from "../Modules/dao.js";
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
        const all = await dao.findAllCourses();
        res.json(all);
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
        const m = await modulesDao.createModule({ ...req.body, course: req.params.courseId });
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