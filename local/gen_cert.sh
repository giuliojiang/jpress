#! /bin/bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout private.key -out cert.crt
openssl x509 -in cert.crt -out cert.pem -outform PEM
