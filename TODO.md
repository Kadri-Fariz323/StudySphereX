# TODO: Fix Server and Frontend Issues for User Registration

## Server-side Fixes
- [x] Change route mount in `server.js` from `/login` to `/auth`

## Frontend Fixes
- [x] Create `loginService.js` in `StudySphereX/src/services/`
- [x] Update `config/index.js` to use `name` and `email` instead of `userName` and `userEmail`
- [x] Update `AuthContext.jsx` to include `handleRegisterUser` and `loginUser` in provider value, and define `loginUser` function
- [ ] Update `Login.jsx` to use correct form data keys (`name` and `email`)

## Testing
- [ ] Test registration and login functionality
