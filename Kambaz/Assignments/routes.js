import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    app.get("/api/courses/:cid/assignments", async (req, res) => {
        try {
            const list = await dao.findAssignmentsForCourse(req.params.cid);
            return res.json(list);
        } catch (e) {
            console.error("GET /api/courses/:cid/assignments error:", e);
            return res.status(500).json({ message: e.message });
        }
    });

    app.get("/api/assignments/:aid", async (req, res) => {
        try {
            const a = await dao.findAssignmentById(req.params.aid);
            if (!a) return res.sendStatus(404);
            return res.json(a);
        } catch (e) {
            console.error("GET /api/assignments/:aid error:", e);
            return res.status(500).json({ message: e.message });
        }
    });

    app.post("/api/courses/:cid/assignments", async (req, res) => {
        try {
            const payload = { ...req.body, course: req.params.cid };
            const created = await dao.createAssignment(payload);
            return res.status(201).json(created);
        } catch (e) {
            console.error("POST /api/courses/:cid/assignments error:", e);
            return res.status(400).json({ message: e.message });
        }
    });

    app.put("/api/assignments/:aid", async (req, res) => {
        try {
            const updated = await dao.updateAssignment(req.params.aid, req.body);
            if (!updated) return res.sendStatus(404);
            return res.json(updated);
        } catch (e) {
            console.error("PUT /api/assignments/:aid error:", e);
            return res.status(400).json({ message: e.message });
        }
    });

    app.delete("/api/assignments/:aid", async (req, res) => {
        try {
            await dao.deleteAssignment(req.params.aid);
            return res.sendStatus(204);
        } catch (e) {
            console.error("DELETE /api/assignments/:aid error:", e);
            return res.status(500).json({ message: e.message });
        }
    });
}