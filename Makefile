all: server-npm dev-npm

server-npm:
	cd server && npm install

dev-npm:
	cd dev && npm install

start:
	cd server && node index.js

start-dev:
	cd dev && node index.js

run-setup:
	cd dev && node setup.js
