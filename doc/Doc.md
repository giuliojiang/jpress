# Client global variables

`jpress.main.BASEURL` The client global variable `BASEURL` stores the base url (starting with a /) to be used to create relative URLs. The BASEURL is dynamically initialized by the server and injected in the HTML file as a script tag.

`jpress.main.GSIGNIN_CLIENTID` Is used in the google-sign-in library API.

# Server side context jpressContext

`jpressContext.googleClientId` The Google API Client ID for Sign-in services
`jpressContext.mongoConnectionUrl` The MongoDB connection URL
`jpressContext.mongoCollectionName` The name of the target MongoDB collection in which to work

# Messages API

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

```
{
    _id
    table: "posts"
    datePosted: number, milliseconds datetime
    title: string
    body: string, markdown format
}
```