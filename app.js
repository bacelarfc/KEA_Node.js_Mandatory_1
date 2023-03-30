import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import templateEngine from "./templateEngine.js";

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/*===== LOGIN =====*/
const login = templateEngine.readPage("./public/pages/login.html");
const loginPage = templateEngine.renderLoginPage(login, {
    tabTitle: "Login"
});

/*===== INTRODUCTION =====*/
const introduction = templateEngine.readPage("./public/pages/documentation/introduction/introduction.html");
const introductionPage = templateEngine.renderPage(introduction, {
    tabTitle: "Introduction to Node.js",
});

const getStarted = templateEngine.readPage("./public/pages/documentation/introduction/get-started.html");
const getStartedPage = templateEngine.renderPage(getStarted, {
    tabTitle: "Get started with Node.js and Express",
});

const concepts = templateEngine.readPage("./public/pages/documentation/introduction/concepts.html");
const conceptsPage = templateEngine.renderPage(concepts, {
    tabTitle: "Important Node Concepts",
});

/*===== Server-side =====*/
const ssr = templateEngine.readPage("./public/pages/documentation/server-side/ssr.html");
const ssrPage = templateEngine.renderPage(ssr, {
    tabTitle: "Server-side rendering",
});

/*===== JS FUNDAMENTALS =====*/
const jsFundamentals = templateEngine.readPage("./public/pages/documentation/js-fundamentals/js-fundamentals.html");
const jsFundamentalsPage = templateEngine.renderPage(jsFundamentals, {
    tabTitle: "Javascript Fundamentals",
});

const variables = templateEngine.readPage("./public/pages/documentation/js-fundamentals/variables.html");
const variablesPage = templateEngine.renderPage(variables, {
    tabTitle: "Variables in JS",
});

const async = templateEngine.readPage("./public/pages/documentation/js-fundamentals/async-programming.html");
const asyncPage = templateEngine.renderPage(async, {
    tabTitle: "Asynchronous Programming in JS",
});

/*===== ADMIN =====*/
const createDocumentation = templateEngine.readPage("./public/pages/admin/create-documentation.html");
const createDocumentationPage = templateEngine.renderPage(createDocumentation, {
    tabTitle: "Create Documentation",
});

const createNewPage = templateEngine.readPage("./public/pages/admin/create-page.html");
const createNewPagePage = templateEngine.renderPage(createNewPage, {
    tabTitle: "Create a new page",
});


let username = "";
const homeAdmin = templateEngine.readPage("./public/pages/home.html");
// Render the page with username
const homeAdminPage = templateEngine.renderPageAdmin(homeAdmin, {
    tabTitle: "Admin Dashboard",
    username: username
});

app.get("/create-documentation", (req, res) => {
    res.send(createDocumentationPage);
});

app.get("/js-fundamentals", (req, res) => {
    res.send(jsFundamentalsPage);
});

app.get("/introduction", (req, res) => {
    res.send(introductionPage);
});

app.get("/", (req, res) => {
    res.send(loginPage);
});

app.get("/get-username", (req, res) => {
    if (username) {
        res.json({ username });
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
});

app.get("/home", (req, res) => {
    res.send(homeAdminPage);
});

app.get("/variables", (req, res) => {
    res.send(variablesPage);
});

app.get("/async-programming", (req, res) => {
    res.send(asyncPage);
});

app.get("/get-started", (req, res) => {
    res.send(getStartedPage);
});

app.get("/node-concepts", (req, res) => {
    res.send(conceptsPage);
});

app.get("/server-side-rendering", (req, res) => {
    res.send(ssrPage);
});

app.get("/create-page", (req, res) => {
    res.send(createNewPagePage);
});

app.get("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/");
});

app.post("/create-documentation", (req, res) => {
    console.log(req.body.content);
    res.send("Documentation page created");
});

//only works in postman
app.post("/create-page", async (req, res) => {
    const { title, content } = req.body;
    const __dirname = path.dirname(new URL(import.meta.url).pathname);

    console.log('Request body:', req.body);

    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Both title and content are required.' });
    }

    const fileName = title.toLowerCase().replace(/ /g, '-');
    const pagePath = path.join(__dirname, 'public', 'pages', `${fileName}.html`);

    const newPageContent = templateEngine.renderCreatePage(content, {
        tabTitle: title,
        content: content
    });
    console.log('New page content:', newPageContent); 
    try {
        const urlObject = new URL(pagePath, `http://${req.headers.host}`);
        const dirPath = urlObject.pathname.replace(urlObject.search, '');
        await templateEngine.savePage(dirPath, newPageContent);
        res.status(201).json({ success: true, message: 'Page created successfully.' });
    } catch (error) {
        console.error('Error:', error); // Log the error
        res.status(500).json({ success: false, message: 'Failed to create the page.', error: err.message });
    }
});

app.post("/", (req, res) => {
    console.log(req.body);

    const submittedUsername = req.body.username;
    const password = req.body.password;

    if (submittedUsername === "user" && password === "pass") {
        username = submittedUsername;
        res.cookie('username', submittedUsername, {
            maxAge: 2 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: true // only transmit the cookie over HTTPS
        });
        res.redirect("/home");
    } else {
        res.send("Invalid username or password")
    }
});


const PORT = 8080;
app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Listening on port ", PORT);
});