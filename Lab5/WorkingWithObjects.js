// Define in-memory assignment object
const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
};

// Export function to register routes
export default function WorkingWithObjects(app) {
    // Retrieve entire assignment
    app.get("/lab5/assignment", (req, res) => {
        res.json(assignment);
    });

    // Retrieve title
    app.get("/lab5/assignment/title", (req, res) => {
        res.json(assignment.title);
    });

    // Update title
    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
    });

    // Update score
    app.get("/lab5/assignment/score/:newScore", (req, res) => {
        const { newScore } = req.params;
        assignment.score = parseInt(newScore);
        res.json(assignment);
    });

    // Update completed
    app.get("/lab5/assignment/completed/:completed", (req, res) => {
        const { completed } = req.params;
        assignment.completed = completed === "true";
        res.json(assignment);
    });
}
