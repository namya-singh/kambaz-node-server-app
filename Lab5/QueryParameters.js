export default function QueryParameters(app) {
    app.get("/lab5/calculator", (req, res) => {
        const { a, b, operation } = req.query;
        const x = parseInt(a, 10);
        const y = parseInt(b, 10);
        let result;

        switch (operation) {
            case "add":
                result = x + y;
                break;

            case "subtract":
                result = x - y;
                break;

            case "multiply":
                result = x * y;
                break;

            case "divide":
                if (y === 0) {
                    return res.status(400).send("Cannot divide by zero");
                }
                result = x / y;
                break;

            default:
                return res.status(400).send("Invalid operation");
        }

        res.send(result.toString());
    });
}