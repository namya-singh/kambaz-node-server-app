


import model from "./model.js";
import EnrollmentModel from "./model.js";

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
export const findEnrollmentsByCourse = (courseId) => {
    return EnrollmentModel.find({ course: courseId }).exec(); // This line uses EnrollmentModel
};