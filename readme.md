[![Build Status](https://travis-ci.org/alfonsodev/node-todo-mongo.png?branch=master)](https://travis-ci.org/alfonsodev/node-todo-mongo) [![Coverage Status](https://coveralls.io/repos/alfonsodev/node-todo-mongo/badge.png)](https://coveralls.io/r/alfonsodev/node-todo-mongo)

Node-Todo-mongo-api
=======================
This is a simple Todo REST API written as an exercise.
It was intended to practice mongoose, Q, and testing.

Install dependencies  

    npm install

Startig the server
    node server

This will start the server at http://localhost:3000  
You have a set of env vars that you can customize  

    TODO_DBHOST # for a custom db host, default localhost
    TODO_DBPORT # for a custom db port, default mongo defaults 27018
    TODO_PORT   #start the server in a different port

##Running Tests
you can run unit and integration tests together with:  

    make test

Service test require that you start the server previously, then can run:

    make test-service

Otherwise you can run each kind of test with:

###Unit
    mocha --reporter spec test/unit/*

### Integration
    mocha --reporter spec test/integration/*  
###Service
    mocha --reporter spec test/service/*

##Code coverage
To obtain a test coverage report
    make coverage

To see the *code coverage*
    open html-report/index.html
