# Frontend design

## Write

### Title, Text, Preview

The user here can input title, text, and get a preview of the post after MarkDown rendering.

### Upload button

The user can upload files here.

The upload progress bar will be shown here.

### Linked files

File uploads linked with the current post.

Each file can have 3 buttons:

* Insert image
* Insert link
* Delete

Insert image appears only if the image has a .png .jpg .jpeg .gif extension.

# Frontend hash format

`hash.service.js` listens and manages changes to the URL's hash component. Allows the user to follow direct links to different parts of the site

Encoding of URI components:

JSON string of [target, data...]

The target encodes the path that needs to be activated, for example `posts`.

`data` is arbitrary data that will be passed to the controller.

The controller will receive the full array, including the target part.

Targets that can handle `hashchange` events will register on this service using the `register()` method.

The registered handle has the shape `function(hash_component)` where `hash_component` is the type of js array defined above.