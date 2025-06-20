// //
// // import { v4 as uuidv4 } from "uuid";
// // import Database from "../Database/index.js";
// //
// // export function findAllCourses() {
// //     return Database.courses;
// // }
// // export function findCoursesForEnrolledUser(userId) {
// //     const { courses, enrollments } = Database;
// //     const enrolledCourses = courses.filter((course) =>
// //                                                enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
// //     return enrolledCourses;
// // }
// //
// // export function createCourse(course) {
// //     const newCourse = { ...course, _id: uuidv4() };
// //     Database.courses = [...Database.courses, newCourse];
// //     return newCourse;
// // }
// // export function deleteCourse(courseId) {
// //     const { courses, enrollments } = Database;
// //     Database.courses = courses.filter((course) => course._id !== courseId);
// //     Database.enrollments = enrollments.filter(
// //         (enrollment) => enrollment.course !== courseId
// //     );}
// // export function updateCourse(courseId, courseUpdates) {
// //     const { courses } = Database;
// //     const course = courses.find((course) => course._id === courseId);
// //     Object.assign(course, courseUpdates);
// //     return course;
// // }
// //
// //
// //
//
//
// import { v4 as uuidv4 } from "uuid";
// import model from "./model.js";
//
// // Get all courses
// export async function findAllCourses() {
//     return await model.find();
// }
//
// // Get courses for a user enrolled in them (assuming you have an Enrollment model or similar)
// import enrollmentModel from "../Enrollments/model.js";  // adjust path accordingly
//
// export async function findCoursesForEnrolledUser(userId) {
//     // Find all enrollments for the user
//     const enrollments = await enrollmentModel.find({ user: userId });
//     const courseIds = enrollments.map(e => e.course);
//
//     // Find all courses with those courseIds
//     return await model.find({ _id: { $in: courseIds } });
// }
//
// // Create a new course
// export async function createCourse(course) {
//     // Add _id manually with uuidv4 (optional, Mongoose can generate ObjectIds automatically)
//     const newCourse = new model({ ...course, _id: uuidv4() });
//     // return await newCourse.save();
//
//
//     return model.create(newCourse);
//
// }
//
// // Delete a course and related enrollments
// export async function deleteCourse(courseId) {
//     // Delete the course
//     await model.deleteOne({ _id: courseId });
//
//     // Delete enrollments related to the course
//     await enrollmentModel.deleteMany({ course: courseId });
// }
//
// // Update a course by ID
// export async function updateCourse(courseId, courseUpdates) {
//     // return await model.findByIdAndUpdate(courseId, courseUpdates, { new: true });
//     return model.updateOne({ _id: courseId }, { $set: courseUpdates });
//
// }
// export function deleteCourse(courseId) {
//     return model.deleteOne({ _id: courseId });
// }
//



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