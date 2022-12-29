// express, routers
const express = require("express")
const app = express();

// configs
const handlebars = require("express-handlebars")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")

const cookieparser = require("cookie-parser")
const logger = require("morgan")

const mongoose = require("mongoose")

const { server, error, database } = require("./helpers/HMessages")

// application

const port = 8000;

app.use(session({
    secret: "123",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 1000 }
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieparser());
app.use(express.static(path.join(__dirname, "public")))

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
})

app.engine('handlebars', handlebars.engine({ defaultLayout: "main" }))
app.set('view engine', 'handlebars');

mongoose.connect("mongodb://localhost/crud").then(() => {
    database("mongoose aberto e operando com MongoDB")
}).catch(err => {
    error(err)
})

app.use("/", require("./routes/client"))

app.listen(port, () => {
    server("servidor aberto e operando na porta " + port + `: http://localhost:${port}`)
})