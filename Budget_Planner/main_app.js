console.log("App starting...");
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("hbs", exphbs.engine({
    extname: "hbs",
    defaultLayout: "main"
}));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "budget_planner"
});

db.connect(err => {
    if (err) console.log("DB connection failed");
    else console.log("Connected to MySQL");
});


app.get("/", (req, res) => {
    res.render("home");
});

app.post("/login", (req, res) => {

    const user_name = req.body.user_name;

    db.query(
        "SELECT * FROM users WHERE user_name = ?",
        [user_name],
        (err, result) => {
            if (err) return res.send("Database error");

            if (result.length > 0) {
                res.redirect("/dashboard?user_name=" + user_name);
            } else {
                db.query(
                    "INSERT INTO users (user_name, budget) VALUES (?, ?)",
                    [user_name, 0],
                    (err) => {
                        if (err) return res.send("Insert error");
                        res.redirect("/dashboard?user_name=" + user_name);
                    }
                );
            }
        }
    );
});

app.get("/dashboard", (req, res) => {
    const user_name = req.query.user_name;

    db.query(
        "SELECT * FROM users WHERE user_name = ?",
        [user_name],
        (err, userResult) => {
            if (err) return res.send("User error");
            let budget = 0;
            if (userResult.length > 0) {
                budget = userResult[0].budget;
            }

            db.query("SELECT * FROM expenses WHERE user_name = ?",
                [user_name],
                (err, rows) => {

                    if (err) return res.send("Database error");
                    let total = 0;
                    rows.forEach(e => {
                        total += e.amount;
                    });

                    let remaining = budget - total;

                    res.render("dashboard", {
                        layout: "dash_layout",
                        expenses: rows,
                        total: total,
                        remaining: remaining,
                        budget: budget,
                        user_name: user_name
                    });

                });

        }
    );
});

app.post("/add", (req, res) => {

    const name = req.body.name;
    const amount = req.body.amount;
    const category = req.body.category;
    const user_name = req.body.user_name;

    db.query(
        "INSERT INTO expenses (name, amount, category, user_name) VALUES (?, ?, ?, ?)",
        [name, amount, category, user_name],
        (err) => {
            if (err) return res.send("Insert error");
            res.redirect("/dashboard?user_name=" + user_name);
        }
    );
});

app.get("/delete/:id/:user_name", (req, res) => {

    const id = req.params.id;
    const user_name = req.params.user_name;

    db.query("DELETE FROM expenses WHERE id=?", [id], (err) => {
        if (err) return res.send("Delete error");
        res.redirect("/dashboard?user_name=" + user_name);
    });

});


app.post("/setbudget", (req, res) => {

    const budget = req.body.budget;
    const user_name = req.body.user_name;

    db.query(
        "UPDATE users SET budget = ? WHERE user_name = ?",
        [budget, user_name],
        (err) => {
            if (err) return res.send("Update error");
            res.redirect("/dashboard?user_name=" + user_name);
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});