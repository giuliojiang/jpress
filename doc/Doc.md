# Client global variables

`jpress.main.BASEURL` The client global variable `BASEURL` stores the base url (starting with a /) to be used to create relative URLs. The BASEURL is dynamically initialized by the server and injected in the HTML file as a script tag.

`jpress.main.GSIGNIN_CLIENTID` Is used in the google-sign-in library API.

# Server side context jpressContext

`jpressContext.googleClientId` The Google API Client ID for Sign-in services

`jpressContext.mongoConnectionUrl` The MongoDB connection URL

`jpressContext.mongoCollectionName` The name of the target MongoDB collection in which to work

`jpressContext.enableLogging` Boolean. Enable or disable verbose logging

# Template engine

TODO resume

HTML documents go through a custom template engine in NodeJS.

The element in which the header is inserted has the ID `jpress-header`.

The element in which the footer is inserted has the ID `jpress-footer`.

The template engine also injects the contents of `template/jpress.js` into the HTML as first child of head. `jpress.js` also goes through replacement for base URL and google Client ID.

# Messages API

## General

TODO
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
    body: string
}

{
    _t: "write_post",
    status: true/false
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