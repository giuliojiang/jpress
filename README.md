# jpress

A minimalistic blog

# Quickstart

Install npm modules

```
make
```

Configure editor's username and password, and choose server port

```
make run-setup
```

Copy your SSL cert files to `local/private.key` and `local/cert.pem`.

You can run a dev HTTPS server for local testing using

```
make start-dev
```

To run the main server (socket.io) run

```
make start
```
