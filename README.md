# Build a REST API with Node.js - Express.js, Mongoose & MongoDB

### The app implements simple organization user structure management operations:

1. Administrator (top-most user - A1)
2. Boss (any user with at least 1 subordinate - A2)
3. Regular user (user without subordinates - A3)

Each user except the Administrator has a boss (strictly one)

```

```

### The REST API endpoints exposes:

1. Register user (A1, A2, A3)
2. Login in / Authenticate as a user
3. Return list of users, taking into account with authorization
4. Change user's boss (only boss has this option and can do it for his subordinates)

### Permissions
- administrator can see everyone
- boss can see himself and all subordinates (recursively)
- regular user can see only himself

-----------------------------------------------------------

### What you will need?
1. Clone this repository: https://github.com/MME83/incode-task
2. An IDE (VS Code or WebStorm)
3. A package manager such as NPM or Yarn
4. Installed Node.js (min v.16.17.x)
5. Docker & docker-compose, download from: https://www.docker.com/

### Install and run app
1. Install all packages/modules using comand promt/terminal/git bash/ etc (for example: `npm install` || `npm i`)
2. Run command (from repo path): `docker-compose up` in your terminal/bash/shell for deploying and running MongoDB as a docker container
3. Run command (from repo path): `npm start`

### Testing api server
- Use POSTMAN: https://www.postman.com/
- Use swagger api: http://localhost:8080/docs
- Open or Cope api docs in JSON: http://localhost:8080/docs.json


