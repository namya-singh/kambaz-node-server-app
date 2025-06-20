import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
            _id:      String,
            title:    { type: String, required: true },
            descriptionHtml: String,
            points:   Number,
            availableFrom: String,
            dueDate:  String,
            availableUntil: String,
            course:   { type: String, ref: "CourseModel", required: true },
    },
    { collection: "assignments" }
);

export default assignmentSchema;