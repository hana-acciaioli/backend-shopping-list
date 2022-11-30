# Half-Baked Shopping List

**Please read the description carefully before starting this deliverable**

## Demo

[Link to Demo](https://alchemy-shopping-front-end-demo.netlify.app/)

## Getting Started

Use [this template](https://github.com/alchemycodelab/backend-shopping-list) to get started.

### Learning Objectives

- Add CORS middleware to allow requests from a specific domain
- Parse authentication cookie to associate data with a specific user
- Add authorization middleware that parses auth cookie to add row-level security to your database

### Description

A backend developer quit half-way through building out a shopping list endpoint for your friend's startup. They have enlisted your help in finishing the application. Thankfully, the front-end is already built, all you need to do is finish up the missing CRUD routes and ensure that the application allows cross-origin requests from the front-end.

The front-end for this application has been built for you and can be found [here](https://alchemy-shopping-front-end-demo.netlify.app/) -- notice that there is an input for your backend url. While testing you can set that to `http://localhost:7890` and once your site is deployed, you can change it to your deployed URL. Its VERY important to check that your app works BOTH locally and on production. Cookies and CORS can act differently depending on the environment.

### Acceptance Criteria

- Backend application is able to receive requests from the demo front end (i.e. CORS is enabled)
- All items CRUD routes implemented (you don't need a detail route - only list)
- All items CRUD routes are limited to the authenticated user (for example at `/api/v1/items/` you only see items with the same user_id as the authenticated user)
- All existing tests are passing

### Rubric

| Task                                                                             | Points |
| -------------------------------------------------------------------------------- | ------ |
| CORS enabled for https://alchemy-shopping-front-end-demo.netlify.app/            | 1      |
| GET `/api/v1/items/` lists all items for the authenticated user                  | 2      |
| POST `/api/v1/items/` creates a new item for the authenticated user              | 2      |
| PUT `/api/v1/items/:id` updates an item if associated with authenticated user    | 2      |
| DELETE `/api/v1/items/:id` deletes an item if associated with authenticated user | 2      |
| PUT and DELETE routes use an authorize middleware to check authed user           | 1      |
