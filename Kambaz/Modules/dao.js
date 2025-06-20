// import Database from "../Database/index.js";
// import model from "./model.js"; // ✅ Mongoose model import
// import { v4 as uuidv4 } from "uuid";
//
// // ✅ Refactored: Uses Mongoose to find modules by course
// export function findModulesForCourse(courseId) {
//     return model.find({course: courseId});
// }
//
// // ✅ Refactored: Uses Mongoose to create module in DB
// export function createModule(module) {
//     const newModule = { ...module, _id: uuidv4() };
//     return model.create(newModule);
// }
//
// //  Still using in-memory update
// export function updateModule(moduleId, moduleUpdates) {
//     return model.updateOne({ _id: moduleId }, moduleUpdates);
//
// }
//
//
// export function deleteModule(moduleId) {
//     return model.deleteOne({ _id: moduleId });
//
// }



import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export const findModulesForCourse = (cid) =>
    model.find({ course: cid });

export const createModule = (module) => {
    const newModule = { ...module, _id: uuidv4() };
    return model.create(newModule);
};

export const updateModule = (id, module) =>
    model.findByIdAndUpdate(id, module, { new: true });

export const deleteModule = (id) =>
    model.findByIdAndDelete(id);
