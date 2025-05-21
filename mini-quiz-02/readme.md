# Mini Quiz 2 (NO AI)
### 1) Create an express server (5 minutes)
- Refer to Lab 01
- Make sure to run your express app with nodemon so that changes are loaded
### 2) Connect your express App to MongoDB (10 minutes)
- You can refer to Lab 03 Part 2 for guidance
- Make sure to install the correct mongodb version
- Make sure to include the "connect" utility function
### 3) Write an endpoint to add a new tag (15 minutes)
- It should be a POST endpoint: "/tag"
- Your endpoint should add a new tag into your DB
- Send the name of the new tag in the BODY of the request
- Add a simple validation to check if user sent the name of the new tag when 
sending a POST request to this endpoint
    - "Please provide a tag name"
    - (optional) Check if tag is existing. "Tag already exist"
### 4) Write an endpoint to delete a tag by ID (10 minutes)
- It should be a DELETE endpoint: "/tag/:id"
- Your endpoint should delete the corresponding tag with the ID sent