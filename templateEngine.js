import fs from "fs";
import escape from "escape-html";

function readPage(pagePath) {
    return fs.readFileSync(pagePath).toString();
}

function renderPage(page, config = {}) {
    const sidebar = fs.readFileSync("./public/components/construction/template-start.html").
        toString()
        .replace("$TAB_TITLE", config.tabTitle || "")
        .replace("$CSS_LINK", config.cssLink || "");

    return sidebar + page;
}

function renderPageAdmin(page, config = {}) {
    const sidebar = fs.readFileSync("./public/components/construction/template-start.html")
        .toString()
        .replace("$TAB_TITLE", config.tabTitle || "")
        .replace("$CSS_LINK", config.cssLink || "");

    const welcome = config.username ? `Welcome, ${escape(config.username)}!` : "";

    return sidebar + page.replace("$WELCOME_MESSAGE", welcome);
}

function renderCreatePage(page, config = {}) {
    const template = fs
        .readFileSync("./public/components/construction/new-page-template.html")
        .toString()
        .replace("$TAB_TITLE", config.tabTitle || "")
        .replace("$CSS_LINK", config.cssLink || "")
        .replace("$CONTENT", `<div id="content">${page}</div>`);

    const endPageStructure = fs.readFileSync("./public/components/construction/template-end.html").toString()
        .replace("$END", config.tabTitle || "")

    return template + endPageStructure;
}

async function savePage(pagePath, content) {
    await fs.promises.writeFile(pagePath, content);
}

function renderLoginPage(page, config = {}) {
    const layout = fs.readFileSync("./public/components/construction/login-template.html").toString()
        .replace("$TAB_TITLE", config.tabTitle || "")
        .replace("$CSS_LINK", config.cssLink || "");

    return page + layout;
}

export default {
    readPage,
    renderPage,
    renderLoginPage,
    renderPageAdmin,
    renderCreatePage,
    savePage
};