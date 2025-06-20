import * as modulesDao from "./dao.js";



export default function ModuleRoutes(app) {

    app.put("/api/modules/:moduleId", async (req, res) => {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        const status = await modulesDao.updateModule(moduleId, moduleUpdates);
        res.send(status);
    });

    app.delete("/api/modules/:moduleId", async (req, res) => {
        const { moduleId } = req.params;
        const status = await modulesDao.deleteModule(moduleId);
        res.send(status);
    });
    app.put("/api/modules/:moduleId", async (req, res) => {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        const status = await modulesDao.updateModule(moduleId, moduleUpdates);
        res.send(status);
    });
    app.get("/api/courses/:cid/modules", async (req, res) => {
        const { cid } = req.params;
        const modules = await modulesDao.findModulesForCourse(cid);
        res.json(modules);
    });


}
//
// import model from "./model.js";
// import { v4 as uuidv4 } from "uuid";
//
// export const findModulesForCourse = (cid) =>
//     model.find({ course: cid });
//
// export const createModule = (module) => {
//     const newModule = { ...module, _id: uuidv4() };
//     return model.create(newModule);
// };
//
// export const updateModule = (id, module) =>
//     model.findByIdAndUpdate(id, module, { new: true });
//
// export const deleteModule = (id) =>
//     model.findByIdAndDelete(id);
