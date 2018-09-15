"use strict";

const showdown = require("showdown");
const converter = new showdown.Converter();

var mod = {};
var priv = {};
priv.pageLimit = 10; // Number of posts per page
priv.blogTemplatePath = "./../template/index/index.html";
priv.singlePostTemplatePath = "./../template/post/post.html";

// ============================================================================
module.exports.init = async function(jservice) {
    
    mod.domutils = await jservice.get("domutils");
    mod.mongoposts = await jservice.get("mongoposts");
    mod.log = await jservice.get("log");
    mod.context = await jservice.get("context");

}

// ============================================================================
// Parameters:
//     pageNumber: the page number that the user requested. 0 for front page
//     baseUrl: request base URL to create appropriate links
// Return:
//     dom: the populated HTML DOM object
module.exports.getPosts = async function(pageNumber, baseUrl) {

    // Load the main template
    var mainDom = await mod.domutils.loadDom(priv.blogTemplatePath);

    // Query database for posts
    var posts = await mod.mongoposts.getLastPosts(priv.pageLimit, pageNumber * priv.pageLimit);

    // Case when there are no posts at this page number
    if (posts.length == 0) {
        return await module.exports.generateLinkbackPage(mainDom, baseUrl);
    }

    // Inject posts into the template
    var container = mainDom.window.document.getElementById("jpress-posts-container");
    if (!container) {
        throw new Error("postsprocessor: No element with ID jpress-posts-container");
    }
    for (var i = 0; i < posts.length; i++) {
        var aPostDoc = posts[i];
        var aPostElement = module.exports.createPostElement(mainDom, aPostDoc.title, aPostDoc.body, baseUrl, aPostDoc._id);
        container.appendChild(aPostElement);
    }

    // Set destination for More link
    var moreElem = mainDom.window.document.getElementById("jpress-index-more-link");
    moreElem.setAttribute("href", baseUrl + "/more/" + (pageNumber + 1));

    // Set page title
    if (pageNumber == 0) {
        mainDom.window.document.title = mod.context.getContext().blogName + " - Home";
    } else {
        mainDom.window.document.title = 
            mod.context.getContext().blogName + " - Archive page " + (pageNumber + 1);
    }

    return mainDom;
}

// ============================================================================
module.exports.createPostElement = function(dom, title, bodyMd, baseUrl, postId) {

    mod.log.info("postsprocessor: Creating post with title ["+ title +"]");

    var parent = dom.window.document.createElement("div");
    parent.setAttribute("class", "jgrid-fullsize-x jgrid-v jgrid-card");

    // Create title section
    var titleSection = dom.window.document.createElement("div");
    // H2 element
    var titleElem = dom.window.document.createElement("a");
    titleElem.innerHTML = title;
    titleElem.setAttribute("class", "jpress-post-title");
    titleElem.setAttribute("href", baseUrl + "/post/" + postId);
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

// ============================================================================
// Return:
//     dom: HTML DOM object
module.exports.generateLinkbackPage = async function(dom, baseUrl) {
    var container = dom.window.document.getElementById("jpress-posts-container");

    // Message element
    var msgElem = dom.window.document.createElement("div");
    container.appendChild(msgElem);
    msgElem.setAttribute("class", "jpress-homepage-message");
    msgElem.innerHTML = "No posts";

    // Back to homepage button
    var backButton = dom.window.document.createElement("a");
    container.appendChild(backButton);
    backButton.setAttribute("class", "jpress-homepage-backbutton");
    backButton.innerHTML = "Back to homepage";
    backButton.setAttribute("href", baseUrl + "/");

    // Hide the more posts button
    var moreElem = dom.window.document.getElementById("jpress-index-more-link");
    moreElem.style.display = "none";

    // Set title
    dom.window.document.title = mod.context.getContext().blogName + " - Not found";

    return dom;
}

// ============================================================================
// Return:
//     dom: HTML DOM object
module.exports.getSinglePost = async function(baseUrl, postId) {
    var docs = await mod.mongoposts.getSinglePost(postId);
    mod.log.info("postsprocessor: getSinglePost. Number of documents: " + docs.length);
    if (docs.length == 1) {
        return await module.exports.getSinglePostExists(baseUrl, docs[0]);
    } else {
        return null;
    }
};

module.exports.getSinglePostExists = async function(baseUrl, theDoc) {
    var dom = await mod.domutils.loadDom(priv.singlePostTemplatePath);

    var container = dom.window.document.getElementById("jpress-posts-container");

    var postElem = module.exports.createPostElement(dom, theDoc.title, theDoc.body, baseUrl, theDoc._id);
    container.appendChild(postElem);

    // Set page title
    dom.window.document.title = mod.context.getContext().blogName + " - " + theDoc.title;

    return dom;
};
