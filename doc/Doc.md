# Client global variables

`jpress.main.BASEURL` The client global variable `BASEURL` stores the base url (starting with a /) to be used to create relative URLs. The BASEURL is dynamically initialized by the server and injected in the HTML file as a script tag.

`jpress.main.GSIGNIN_CLIENTID` Is used in the google-sign-in library API.

`jpress.main.BLOG_NAME` Is the name of the blog as displayed.

# Server side context jpressContext

`jpressContext.googleClientId` The Google API Client ID for Sign-in services

`jpressContext.mongoConnectionUrl` The MongoDB connection URL

`jpressContext.mongoCollectionName` The name of the target MongoDB collection in which to work

`jpressContext.enableLogging` Boolean. Enable or disable verbose logging

`jpressContext.blogName` Name of the blog

# Template engine

HTML documents go through a custom template engine in NodeJS.

The element in which the header is inserted has the ID `jpress-header`.

The element in which the footer is inserted has the ID `jpress-footer`.

The template engine also injects the contents of `template/jpress.js` into the HTML as first child of head. `jpress.js` also goes through replacement for base URL and google Client ID.

# Messages API

## General

User logs out. The message is also sent to the server to avoid an attacker being able to keep using a token stored in cache.
```
{
    _t: "general_logout",
    _tok: authentication token
}

{
    _t: "general_logout"
}
```

Sent by server when user attempts to do something he doesn't have the permission to
```
{}

{
    _t: "general_unauthorized"
}
```

Sent by the server upon internal error
```
{
    _t: "general_error"
}
```


## Write

```
{
    _t: "write_preview",
    _tok: authentication token,
    text: string
}

{
    _t: "write_preview",
    html: string
}
```

```
{
    _t: "write_post",
    _tok: authentication token,
    title: string,
    body: string,
    postid: string  // db post id for editing a post. null for new post
}

{
    _t: "write_post",
    status: true/false,
    message: string, error message to be displayed to the user if present
}
```

```
Fetch an existing post when editing in the write panel
{
    _t: "write_fetch",
    _tok: authentication token,
    postid: string
}

{
    _t: "post"
    title: string,
    body: string
}
OR
{
    _t: "nopost"
}
```

## Panel

```
{
    _t: "panel_login",
    _tok: authentication token
}

{ // OK
    _t: "panel_login"
}
{ // Fail
    _t: "general_unauthorized"
}
```

```
{
    _t: "panel_delete_by_id",
    _tok: authentication token,
    postid: string
}

{
    status: "ok"
}
OR
{
    status: "fail"
}
```

# Database

Based on MongoDB

Collection is named `jpress`.

## Posts

Blog posts

```
{
    _id
    table: "posts"
    datePosted: number, milliseconds datetime
    title: string
    body: string, markdown format
}
```

## Auth

Logged in users are cached for 5 minutes on the MongoDB database.

```
{
    _id
    table: "auth",
    googleToken: token,
    userId: unique google user id,
    name: string,
    isAdmin: true/false,
    loginTime: datetime milliseconds
}
```

## User

Actual registered users (that can write posts)

```
{
    _id
    table: "user",
    userId: unique google user id
}
```