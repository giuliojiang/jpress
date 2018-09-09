"use strict";

const showdown = require("showdown");
const converter = new showdown.Converter();

var mod = {};
var priv = {};
priv.pageLimit = 10; // Number of posts per page
priv.templatePath = "./../template/index/index.html";

// ============================================================================
module.exports.init = async function(jservice) {
    
    mod.domutils = await jservice.get("domutils");
    mod.mongoposts = await jservice.get("mongoposts");
    mod.log = await jservice.get("log");

}

// ============================================================================
// Parameters:
//     pageNumber: the page number that the user requested. 0 for front page
//     baseUrl: request base URL to create appropriate links
// Return:
//     dom: the populated HTML DOM object
module.exports.getPosts = async function(pageNumber, baseUrl) {

    // Load the main template
    var mainDom = await mod.domutils.loadDom(priv.templatePath);

    // Query database for posts
    var posts = await mod.mongoposts.getLastPosts(priv.pageLimit, pageNumber * priv.pageLimit);

    // Inject posts into the template
    var container = mainDom.window.document.getElementById("jpress-posts-container");
    if (!container) {
        throw new Error("postsprocessor: No element with ID jpress-posts-container");
    }
    for (var i = 0; i < posts.length; i++) {
        var aPostDoc = posts[i];
        var aPostElement = module.exports.createPostElement(mainDom, aPostDoc.title, aPostDoc.body);
        container.appendChild(aPostElement);
    }

    return mainDom;
}

// ============================================================================
module.exports.createPostElement = function(dom, title, bodyMd) {

    mod.log.info("postsprocessor: Creating post with title ["+ title +"]");

    var parent = dom.window.document.createElement("div");
    parent.setAttribute("class", "jgrid-fullsize-x jgrid-v jgrid-card");

    // Create title section
    var titleSection = dom.window.document.createElement("div");
    // H2 element
    // TODO link to open the specific post
    var titleElem = dom.window.document.createElement("h1");
    titleElem.innerHTML = title;
    titleElem.setAttribute("class", "jpress-post-title");
    titleSection.appendChild(titleElem);
    parent.appendChild(titleSection);

    // Compile body Markdown to HTML
    var bodyHtml = converter.makeHtml(bodyMd);

    // Create body section
    var bodySection = dom.window.document.createElement("div");
    bodySection.setAttribute("class", "jpress-post-body");
    bodySection.innerHTML = bodyHtml;
    parent.appendChild(bodySection);

    return parent;
}