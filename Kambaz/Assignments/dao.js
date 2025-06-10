import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAssignmentsForCourse(courseId) {
    return Database.assignments.filter(a => a.course === courseId);
}

export function findAssignmentById(aid) {
    return Database.assignments.find(a => a._id === aid);
}

export function createAssignment(data) {
    const newAssn = { ...data, _id: uuidv4() };
    Database.assignments.push(newAssn);
    return newAssn;
}

export function updateAssignment(aid, updates) {
    const assn = findAssignmentById(aid);
    if (!assn) return null;
    Object.assign(assn, updates);
    return assn;
}

export function deleteAssignment(aid) {
    Database.assignments = Database.assignments.filter(a => a._id !== aid);
}