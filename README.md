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





