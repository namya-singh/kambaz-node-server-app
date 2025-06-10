export default function PathParameters(app) {
    app.get("/lab5/add/:a/:b", (req, res) => {
        const { a, b } = req.params;
        const result = parseInt(a, 10) + parseInt(b, 10);
        res.send(result.toString());
    });

    app.get("/lab5/subtract/:a/:b", (req, res) => {
        const { a, b } = req.params;
        const result = parseInt(a, 10) - parseInt(b, 10);
        res.send(result.toString());
    });

    app.get("/lab5/multiply/:a/:b", (req, res) => {
        const { a, b } = req.params;
        const result = parseInt(a, 10) * parseInt(b, 10);
        res.send(result.toString());
    });

    app.get("/lab5/divide/:a/:b", (req, res) => {
        const { a, b } = req.params;
        const divisor = parseInt(b, 10);

        if (divisor === 0) {
            return res.status(400).send("Cannot divide by zero");
        }

        const result = parseInt(a, 10) / divisor;
        res.send(result.toString());
    });
}