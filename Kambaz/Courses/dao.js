



// Kambaz/Courses/dao.js

import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import * as enrollmentDao from "../Enrollments/dao.js";

export const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
};

export const findAllCourses = () =>
    model.find().exec();


export const findCourseById = (courseId) =>
    model.findById(courseId).exec();


export function updateCourse(courseId, courseUpdates) {
    return model.updateOne(
        { _id: courseId },
        { $set: courseUpdates }
    ).exec();
}

export function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
}


export const findCoursesForEnrolledUser = async (userId) => {
    const enrolls = await enrollmentDao.findEnrollmentsForUser(userId);
    const courseIds = enrolls.map((e) => e.course);
    return model.find({ _id: { $in: courseIds } }).exec();
};