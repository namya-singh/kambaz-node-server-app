let todos = [
    { id: 1, title: "Task 1", completed: false, description: "Description for Task 1" },
    { id: 2, title: "Task 2", completed: true, description: "Description for Task 2" },
    { id: 3, title: "Task 3", completed: false, description: "Description for Task 3" },
    { id: 4, title: "Task 4", completed: true, description: "Description for Task 4" },
];

export default function WorkingWithArrays(app) {
    app.get("/lab5/todos/create", (req, res) => {
        const newTodo = {
            id: new Date().getTime(),
            title: "New Task",
            completed: false,
            description: "",
        };
        todos.push(newTodo);
        res.json(todos);
    });
    app.post("/lab5/todos", (req, res) => {
        const newTodo = {
            ...req.body,
            id: new Date().getTime()
        };
        todos.push(newTodo);
        res.json(newTodo);
    });


    app.get("/lab5/todos/:id/title/:title", (req, res) => {
        const { id, title } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) {
            todo.title = decodeURIComponent(title);
            res.json(todos);
        } else {
            res.status(404).json({ error: "Todo not found" });
        }
    });

    app.get("/lab5/todos/:id/delete", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex !== -1) {
            todos.splice(todoIndex, 1);
            res.json(todos);
        } else {
            res.status(404).json({ error: "Todo not found" });
        }
    });
    app.delete("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
            return;
        }

        todos.splice(todoIndex, 1);
        res.sendStatus(200);
    });
    app.put("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
            return;
        }

        todos = todos.map((t) => {
            if (t.id === parseInt(id)) {
                return { ...t, ...req.body };
            }
            return t;
        });
        res.sendStatus(200);
    });



    // Get all todos or filtered by completed status
    app.get("/lab5/todos", (req, res) => {
        const { completed } = req.query;
        if (completed !== undefined) {
            const completedBool = completed === "true";
            const filteredTodos = todos.filter((t) => t.completed === completedBool);
            res.json(filteredTodos);
            return;
        }
        res.json(todos);
    });

    // Get single todo by id
    app.get("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).json({ error: "Todo not found" });
        }
    });

    // Update description
    app.get("/lab5/todos/:id/description/:description", (req, res) => {
        const { id, description } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) {
            todo.description = decodeURIComponent(description);
            res.json(todos);
        } else {
            res.status(404).json({ error: "Todo not found" });
        }
    });

    // Update completed status
    app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
        const { id, completed } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) {
            todo.completed = completed === "true";
            res.json(todos);
        } else {
            res.status(404).json({ error: "Todo not found" });
        }
    });
}
