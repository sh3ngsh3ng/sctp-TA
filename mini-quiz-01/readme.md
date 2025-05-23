# Mini Quiz 1
### 1) Create an express server (15 minutes)
- Refer to Lab 01
- Make sure to run your express app with nodemon so that changes are loaded
### 2) Connect your express App to MongoDB (15 minutes)
- You can refer to Lab 03 for guidance
- Make sure to install the correct mongodb version
- Make sure to include the "connect" utility function
### 3) Write an endpoint to retrieve all recipe (15 minutes)
- It should be a GET endpoint: "/recipe"
- Your endpoint should return all recipes in the database
### 4) Write an endpoint to retrieve cuisine by id (15 minutes)
- It should be a GET endpoint
- Your endpoint should have this structure "/cuisine/:id" where <id> is provided by user
### 5) Modify the endpoint in (4) to only return the name and not the document id (5 minutes)
- For this you need to make use of projection