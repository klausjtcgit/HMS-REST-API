# Hotel management system REST API

### Introduction

Hotel REST API is an open source platform written in TypeScript, Node.js, Express, and Mongoose. It provides a scalable and flexible solution for managing hotel-related data and operations, including the management of rooms, booking restaurant inventory, handling employees, and more.

### Features

- Employee
  - Employee manager
- Accommodation
  - Room
  - Guest
  - Booking & reservation
  - Payment & commission
- Restaurant
  - Menu
  - Order
  - Payment
- & more
- ...

### Installation Guide

- Clone this repository [here](https://github.com/klausjtcgit/HMS-REST-API.git).
- Ensure you're working from the `main` branch, as it is the most stable at any given time.
- Run `npm install` to install all dependencies.
- Create an `.env.production.local` file in your project root folder and add your variables.
<!-- Refer to `.env.sample` for assistance. -->

### Usage

- Run `npm start:dev` to start the application.
- Connect to the API using Postman on port 7066.

### API Endpoints

| Method | Endpoints | Action                            |
| ------ | --------- | --------------------------------- |
| POST   | /         | To check if the server is working |

### Technologies Used

- [NodeJS](https://nodejs.org/): Cross-platform runtime environment for running JavaScript codes on the server.
- [ExpressJS](https://www.expresjs.org/): Node.js web application framework.
- [MongoDB](https://www.mongodb.com/): Free open source NOSQL document database with scalability and flexibility.
- [Mongoose ODM](https://mongoosejs.com/): Schema-based solution for MongoDB validation.

### Authors

- [klausJTC](https://github.com/klausjtcgit) <sub> Yohannes Tesfay </sub>

### License

This project is available for use under the MIT License.
