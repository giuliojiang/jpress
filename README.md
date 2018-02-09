# jpress

A minimalistic blog

# Quickstart

Install npm modules

```
make
```

Configure editor's username and password.

```
make run-setup
```

Copy your SSL cert files to `local/private.key` and `local/cert.pem`. For developmet, you can use the script in `local/gen_cert.sh` to self-sign a certificate.

You can run a dev HTTPS server for local testing using

```
make start-dev
```

To run the main server (socket.io) run

```
make start
```
