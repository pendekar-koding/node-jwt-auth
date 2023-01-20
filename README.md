# node-jwt-auth


Signup : 
    * API => localhost:8080/api/auth/signup
    * body =>

{
"username":"pendekar",
"email":"test001@mail.com",
"password":"12345678",
"roles":["moderator", "user","admin"]
}

Signin : 
    *API => localhost:8080/api/auth/signin
    *body =>

{
"username":"pendekar",
"password":"12345678"
}
