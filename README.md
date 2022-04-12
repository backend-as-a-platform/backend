# Backend as a Platform (BaaP) - backend

Installation

`yarn install`

Production build

`yarn build`

Start production server

`yarn start`

Build and start production server

`yarn build:start`

Development mode

`yarn dev`

Run code quality checks

`yarn lint`

Routes

```
01. POST /users/signup - name, email, password
02. POST /users/login - email, password
03. GET /users/verify/:verification-token
04. GET /users/logout
05. GET /users/logout/all
06. GET /users/profile
07. PUT /users/profile - name, email, password
08. DELETE /users/profile
09. POST /users/profile/avatar (multipart-form data - avatar)
10. DELETE /users/profile/avatar
11. GET /users/:id
12. GET /users/:id/send-verification
13. GET /users/:id/avatar.png
14. POST /forms/new - name, description, fields (name, type, required? className, subtype)
15. GET /forms/:id
16. PUT /forms/:id - name, description, fields
17. DELETE /forms/:id
18. POST /forms/:id/records/new
- Input data varies according to the fields of each form.
- Eg. for a text field with the name 'username', the input should be "username": "value".
19. GET /forms/:id/records/:recordId
20. PUT /forms/:id/records/:recordId - Similar to (18).
21. DELETE /forms/:id/records/:recordId
```
