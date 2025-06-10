import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Return all enrollments for a given user
export function findEnrollmentsForUser(userId) {
    return Database.enrollments.filter(e => e.user === userId);
}

// Return a single enrollment by its user+course
export function findEnrollmentByUserCourse(userId, courseId) {
    return Database.enrollments.find(
        e => e.user === userId && e.course === courseId
    );
}

// Create a new enrollment record
export function createEnrollment(userId, courseId) {
    const newE = { _id: uuidv4(), user: userId, course: courseId };
    Database.enrollments.push(newE);
    return newE;
}

// Delete one enrollment by its ID
export function deleteEnrollmentById(enrollmentId) {
    Database.enrollments = Database.enrollments.filter(
        e => e._id !== enrollmentId
    );
}