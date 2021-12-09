# api-starter

Routes

```
01. POST /user/signup - firstname, middlename, lastname, age, username, email, password
02. POST /user/login - email, password
03. GET /user/verify/:verification-token
04. GET /user/logout
05. GET /user/logout/all
06. GET /user/profile
07. PUT /user/profile - firstname, middlename, lastname, age, username, email, password
08. DELETE /user/profile
09. POST /user/profile/avatar (multipart-form data - avatar)
10. DELETE /user/profile/avatar
11. GET /user/:id
12. GET /user/:id/send-verification
13. GET /user/:id/avatar.png
```
