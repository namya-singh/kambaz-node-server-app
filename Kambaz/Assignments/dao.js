import model from "./model.js";
import { v4 as uuidv4 } from "uuid";


export function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId }).exec();
}

export function findAssignmentById(aid) {
    return model.findById(aid).exec();
}

export function createAssignment(data) {
    const withId = { ...data, _id: uuidv4() };
    return model.create(withId);
}

export function updateAssignment(aid, updates) {
    return model
        .findByIdAndUpdate(
            aid,
            { $set: updates },
            { new: true, runValidators: true, context: "query" }
        )
        .exec();
}


export function deleteAssignment(aid) {
    return model.deleteOne({ _id: aid }).exec();
}