// // import model from "./model.js";
// //
// // // Return all courses enrolled by a given user
// // export async function findCoursesForUser(userId) {
// //     const enrollments = await model.find({ user: userId }).populate("course");
// //     return enrollments.map((enrollment) => enrollment.course);
// // }
// //
// //
// // // Return all users enrolled in a given course
// // export async function findUsersForCourse(courseId) {
// //     const enrollments = await model.find({ course: courseId }).populate("user");
// //     return enrollments.map((enrollment) => enrollment.user);
// // }
// //
// // // Enroll a user in a course (creates an enrollment record)
// // export function enrollUserInCourse(user, course) {
// //     return model.create({ user, course, _id: `${user}-${course}` });
// // }
// //
// // // Unenroll a user from a course (deletes an enrollment record)
// // export function unenrollUserFromCourse(user, course) {
// //     return model.deleteOne({ user, course });
// // }
// // export function enrollUserInCourse1(user, course) {
// //     const newEnrollment = { user, course, _id: `${user}-${course}` };
// //     return model.create(newEnrollment);
// // }
// // export function unenrollUserFromCourse1(user, course) {
// //     return model.deleteOne({ user, course });
// // }
//
//
//
//
// import model from "./model.js";
// import mongoose from "mongoose";
//
// /**
//  * Find all enrollments for a given user.
//  * @param {string} userId
//  */
// export async function findEnrollmentsForUser(userId) {
//     return await model.find({ user: userId }).populate("course");
// }
//
// /**
//  * Find all courses enrolled by a given user (returns Course objects).
//  * @param {string} userId
//  */
// export async function findCoursesForUser(userId) {
//     const enrollments = await model.find({ user: userId }).populate("course");
//     return enrollments.map((enrollment) => enrollment.course);
// }
//
// /**
//  * Find all users enrolled in a given course (returns User objects).
//  * @param {string} courseId
//  */
// export async function findUsersForCourse(courseId) {
//     const enrollments = await model.find({ course: courseId }).populate("user");
//     return enrollments.map((enrollment) => enrollment.user);
// }
//
// /**
//  * Find a single enrollment record by userId and courseId.
//  * @param {string} userId
//  * @param {string} courseId
//  */
// export async function findEnrollmentByUserCourse(userId, courseId) {
//     return await model.findOne({ user: userId, course: courseId });
// }
//
// /**
//  * Create a new enrollment record.
//  * @param {string} userId
//  * @param {string} courseId
//  */
// export async function createEnrollment(userId, courseId) {
//     // Compose unique _id for enrollment (optional)
//     const _id = `${userId}-${courseId}`;
//
//     // Make sure IDs are ObjectIds if needed
//     // If your schema uses ObjectId type:
//     // const user = mongoose.Types.ObjectId(userId);
//     // const course = mongoose.Types.ObjectId(courseId);
//     // return await model.create({ _id, user, course });
//
//     // Or just store strings (must match schema)
//     return await model.create({ _id, user: userId, course: courseId });
// }
//
// /**
//  * Delete an enrollment by its _id
//  * @param {string} enrollmentId
//  */
// export async function deleteEnrollmentById(enrollmentId) {
//     return await model.deleteOne({ _id: enrollmentId });
// }



import model from "./model.js";

export async function findEnrollmentsForUser(userId) {
    return model.find({ user: userId });
}

export async function findEnrollmentsForCourse(courseId) {
    return model.find({ course: courseId });
}


export async function findCoursesForUser(userId) {
    const enrolls = await model.find({ user: userId }).populate("course");
    return enrolls.map((e) => e.course);
}


export async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map(e => e.user);
}
export function enrollUserInCourse(userId, courseId) {
    return model.create({
                            _id: `${userId}-${courseId}`,
                            user: userId,
                            course: courseId,
                        });
}

export function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
}