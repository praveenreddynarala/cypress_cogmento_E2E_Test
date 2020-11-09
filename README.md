RestAPI Testing with Cypress

    We like to pretend there are two adjointed end-to-end test types: API and browser automation tests. And that the tools used are very different. Most of the cases E2E tests we perform either in API or browser (client interface); but not mixing by both in signle solution. Yet, a good E2E automation test runner, in my opinion, should be really good at working with a remote server API via HTTP. After all, this is what every useful website does. Every website exchanges data with remote servers through HTTP requests.

    Cypress is the one tool which capable enough to solve both the problems in one single solution. Using Cypress we can perform E2E tests for any REST API's, and also perform E2E testing for both API & client interface (UI).
    
    When it comes to using Cypress, many users think about front-end testing. But we can use Cypress when writing e2e API tests. If there is, e.g., REST API created in our application, automated API tests should be an integral part of the application's e2e tests. Cypress allows us to write these two types of tests. It is undoubtedly convenient because everything is done using one tool and one programming language - JavaScript.
    
    In this paper, we will work with REST API - he REST acronym comes from the English words Representational State Transfer. It is a software architectural style in which we work with resources.

REST API testing - requirements:
So let’s see what are we going to need to run our REST API test with Cypress. Make sure to:

    1. Install Node.js
    2. Install npm
    3. Install Visual Studio Code

Setting up the project:

    1. mkdir cypress-api-tests -> Create directory
    2. cd cypress-api-tests -> Go to created folder
    3. npm init -y -> Create npm package
    4. npm i cypress -> Now install Cypress
    5. npx cypress open -> Run Cypress

Note: Cypress will create forur folders fixtures, plugins, support, and integration. Fixture - where we maintain Rest API response mock / test data in json format. Integration - where we write our tests. By default In integration one there are some example tests, we can delete them all.

Open Project in Visual Studio Code:
    
    1. cmd in above created project folder
    2. Type 'code .' and press {ENTER} key

First API Test:
To run your first REST API test using Cypress, follow these steps:

    1. Go to cypress.json file and add the base URL that will be used in our test
        
    {
        "baseURL": "https://gorest.co.in"
    }

    2. Make a GET request call in beforeEach() hook. It will be executed before each test execution..
    
    beforeEach(() => {
        cy.request({
            method: 'GET',
            url: '/api/users?page=2', 
            headers: {
                'accept': 'application/json'
            }
        }).as('users')
    })

Note: Below listed some of are Request options
        
        1. method -> it expects HTTP Verbs / Methos (GET, POST, PUT, DELETE, PATCH, HEAD..etc.)
        2. url: URL+End Point
        3. auth: Takes authorization (Token, Basic Credentials..etc.)
        4. head: Takes header values (accept: 'application/json')
        5. body: Request body for creating/updating resource

Note: storing the request in alias using 'as' method. Example: .as('@users')

    3. Check GET respone Status Code:

        it('Check response code', () => {
            cy.get('@users') //calling alias
            .its('status')
            .should('equal', 200)
        })

    4. Check response content type:

        it('Check its conetent type',  () => {
            cy.get('@users')
            .its('headers')
            .its('content-type')
            .should('include', 'application/json; charset=utf-8')
        })

    5. Log length of the response body:

        it('Get length of the response body', () => {
            cy.get('@users')
            .its('body')
            .its('data').then(data => {
                cy.log(data.length)
            })
        })

    6. Match actual json response with expected json response using 'deep.equals'

        it('Check actual response body againist expected json response', () => {
            cy.fixture('get_reqres_response.json').as('actual_response')
            let actual_resp
            cy.get('@actual_response')
            .then((actual) => {
            cy.log(actual)
            actual_resp = actual
            })

            cy.get('@users').its('body').then(expected_resp => {
                cy.wrap(expected_resp).should('deep.equal', actual_resp)
            })
        })

Environment Variables:

In real time, we test API's in different environments like DEV, QA, Staging and Production. It means, URL of API's will vary and can't keep it in 'cypress.json' file anymore. In-oder to overcome, we should use concept called Environment Variables. 
    
In Cypress, “environment variables” are variables that are accessible via Cypress.env. These are not the same as OS-level environment variables.
Environment variables are useful when:
    
    1. Values are different across developer machines.
    2. Values are different across multiple environments: (dev, staging, qa, prod)
    3. Values change frequently and are highly dynamic.
    
Please find below steps to setup environment variables.

    1. Create 'cypress.env.json' file at project root folder.
    2. Access envrionment variables in any java script file using 'Cypress.env('Variable-Key-Name')'

Example: cypress.env.json

            {
                "dev_url": "https://dev.in",
                "qa_url": "https://qa.in",
                "staging_url": "https://staging.in",
                "production_url": "https://production.in",
                "auth_client_id": "my_client_id",
                "auth_client_secret": "my_client_secret",
                "auth_username": "auth_username",
                "auth_password": "auth_password",
                "bearer_token": "bearer_token"
            }

Sample GET request using Cypress Environments:

            describe('Reqres.in API - Get Call Requests', () => {
                beforeEach(() => {
                    cy.request({
                        method: 'GET',
                        url:  Cypress.env('reqres_url')+'/api/users?page=2', //reading url from Cypress Enviornments
                        headers: {
                            'accept': 'application/json'
                        }
                    }).as('users')
                })

                it('Check response code', () => {
                    cy.get('@users')
                    .its('status')
                    .should('equal', 200)
                })
            })

Get request using Basic Authentication:

            describe('GET calls using Basic Authentication Tests', () => {
                beforeEach(() => {                                      //BeforeEach Tests
                    cy.request({
                        method:'GET',                                   // Request method
                        url: Cypress.env('github_url')+'/user/repos',   // Reading URL from Cypress environments
                        auth:{                                          //Basic Authentication
                            user: Cypress.env('auth_username'),
                            password: Cypress.env('auth_password')
                        },
                        headers:{                                       //Headers
                            'accept':'application/json'
                        }
                    }).as('request')                                    //Request Alias
                })

                it('Get all repos', () => {                             //Test Case
                    cy.get('@request').then(($response) => {
                        expect($response.status).equal(200)             //Chai Assertions
                        expect($response.body).to.be.not.null
                        expect($response.body[0].name).equal('Appium')
                    })
                })
            })

Get Request using BAERER TOKEN:

        describe('GET calls using Barear Authentication Tests', () => {
            beforeEach(() => {                                          //BeforeEach Test
                cy.request({                                            //Request
                    method:'GET',                                       //Request Method
                    url: Cypress.env('gorest_url')+'/public-api/users', //Reading API Url from Cypress environments
                    auth:{                                              //Baerer Token
                        bearer: Cypress.env('bearer_token')             //Reading Baerer Token from Cypress environments
                    },
                    headers:{                                           //Headers
                        'Content-type':'application/json'
                    }
                }).as('request')                                        //Request Alias
            })

            it('Check status code for all users', () => {               //Test
                cy.get('@request')
                .its('status').should('equal', 200)
            })
        })

Reading and Writing Files in API Requests:

Write API response to JSON file and read it later to validate expected response.

Note: use above Request to make a GET request.
        
        it('Check status code for all users', () => {
            cy.get('@request').then(response => {
                cy.writeFile('cypress/fixtures/save_responses/seved_response.json', response.body)
                cy.readFile('cypress/fixtures/save_responses/seved_response.json').then(json_data => {
                    cy.log(json_data.code)
                    expect(json_data.code).equal(200)
                })
            })
        })

Passing Query Parameters:

Make a request using query parameters using 'qs' parameter in Request method

        describe('Optional Query Parameter tests', () => {
            beforeEach(() => {
                cy.request({
                    method:'GET',
                    url: Cypress.env('gorest_url')+'/public-api/users',
                    qs:{                                                        //Query parameter
                        'id':'1'
                    },
                    headers:{
                        'Content-type':'application/json'
                    }
                }).as('request1')
            })
        })
    
Get length of a response:
        
        it('Get length of the response body', () => {
            cy.get('@users')
            .its('body')
            .its('data').then(data => {
                cy.log(data.length)     //Length 
            })
        })

Check response body should not be null

        it('Expect response body should not be null', () => {
            cy.get('@users')
            .its('body').should('not.be.null')              //Validation
        })

Different validation on Response body:

        it('Check response body', () => {
            cy.get('@users').then(($response) => {
                cy.log($response.body.data)
                cy.log($response.body.data[0])
                cy.log($response.body.data[0].first_name)
                expect($response.status).equal(200)
                expect($response.body.data[0].first_name).equal('Michael')
                expect($response.body).to.not.be.null
                expect($response.body.data).to.have.length(6)
            })
        })

Convert Response to JSON String:

        it('Print complete response body as JSON string', () => {
            cy.get('@users')
            .its('body').then(($expected_response) => { 
                cy.log(JSON.stringify($expected_response))
            })
        })
    
Validate JSON to JSON response:

        it('Check actual response body againist expected json response', () => {
            cy.fixture('get_reqres_response.json').as('actual_response')        //Reading expected response from JSON file
            let actual_resp
            cy.get('@actual_response')
            .then((actual) => {
            cy.log(actual)
            actual_resp = actual
            })

            cy.get('@users').its('body').then(expected_resp => {
                cy.wrap(expected_resp).should('deep.equal', actual_resp)        //JSON to JSON response validation
            })
        })

What is failOnStatusCode?:

'failOnStatusCode' is an opetiona parameter in Request method. Anytime if API return status code starts with 4xx, Cypress will throw exception and it does not retun failed response status and body. To get failed response body, we should use 'failOnStatusCode' as a parameter in Request body as pass 'false'. By default 'failOnStatusCode' is set to 'true' by Cypress.

        it('Single user not found', () => {
            cy.request({
                method: 'GET',
                url: Cypress.env('reqres_url')+'/api/users/23', 
                headers: {
                    'accept': 'application/json'
                },
                failOnStatusCode:false                          //fail on status code if we remove this option or set to true
            }).then(($response) => {
                expect($response.status).equal(404)
            })
        })
    
POST Requests:

        describe('POST requests', () => {
            beforeEach(() => {                                      //BeforeEach call
                cy.request({    
                    method:'POST',                                  //POST method
                    url: Cypress.env('reqres_url')+'/api/users',    //Url and End Point
                    headers:{                                       //Headers
                        accept:'application/json'
                    },
                    body:{                                          //Request body for creating new resource
                        "name": "morpheus",
                        "job": "leader"
                    }
                }).as('request')
            })

Check POST request status:

        it('Check post status', () => {
            cy.get('@request').then(($response) => {
                expect($response.status).equal(201)
                cy.log(JSON.stringify($response.body))
                cy.log($response.body)
            })
        })

Check POST response body:

        it('Check post response body', () => {
            cy.get('@request')
            .its('body').then(expected => {
                cy.log(JSON.stringify(expected))
                cy.wrap(expected).should('include', {"name":"morpheus"})
            })
        })
    
Check missing required parameter:

        describe('Missing required data from POST body checks', () => {
            it('Missing required data Password filed from POST body checks', () => {
                cy.request({
                    method:'POST',
                    url: Cypress.env('reqres_url')+'/api/register',
                    body:{
                        "email": "sydney@fife"
                    },
                    failOnStatusCode: false
                }).as('request')

                cy.get('@request').then(response => {
                    expect(response.status).equal(400)
                    expect(response.body).to.deep.equals({ error: 'Missing password' }) //Validation
                })
            })
        })
    
PATCH Request:

        describe('Patch Update Calls', () => {
    
            beforeEach('Update record before each test', () => {        //Before Each Test Call
                cy.request({
                    method: 'PATCH',                                    //PATCH method
                    url: Cypress.env('reqres_url') + '/api/users/2',    //URL + End Point
                    body: {                                             //Request Body
                        "name": "morpheus",
                        "job": "zion resident"
                    },
                    headers: {                                          //Headers
                        accept: 'application/json'
                    }
                }).as('request')
            })
            
            it('Check status', () => {
                cy.get('@request').then(response => {
                    cy.log(JSON.stringify(response))            //Log Response
                    cy.log(JSON.stringify(response.headers))    //Log Response Headers
                    cy.log(JSON.stringify(response.body))       //Log Response Body
                    cy.log(JSON.stringify(response.body.name))  //Log Response Body Elements
                    expect(response.status).equal(200)          //Check Response Status
                })
            })

Check Updated record:

            it('Check updated record using Should command', () => {
                cy.get('@request').its('body').should('include', {
                    "name": "morpheus",
                    "job": "zion resident"
                })
            })

PUT Calls:

        describe('Patch Update Calls', () => {
            beforeEach('Update record before each test', () => {        //Before Each Test Call
                cy.request({
                    method: 'PUT',                                      //PUT method
                    url: Cypress.env('reqres_url') + '/api/users/2',    //URL + End Point (Specific user)
                    body: {                                             //Request Body to update record
                        "name": "morpheus",
                        "job": "zion resident"
                    },
                    headers: {                                          //Headers
                        accept: 'application/json'
                    }
                }).as('request')
            })
            
Check Status:

            it('Check status', () => {
                cy.get('@request').then(response => {
                    expect(response.status).equal(200)
                })
            })

            Check Updated record:

            it('Check updated record using Should command', () => {
                cy.get('@request').its('body').should('include', {
                    "name": "morpheus",
                    "job": "zion resident"
                })
            })

            Check updated record otherway:

            it('Check update record', () => {
                cy.get('@request').its('body').then(response => {
                    expect(response).to.have.property('name', response.name)
                    expect(response).to.have.property('job', response.job)
                })
            })
        })

Test Data Management:
    
In API testing, Test Data takes a larger potion in validating business logic. Unlike UI, API testing will be performed using different data sets to ensure API business login works as per customer/end user expectation. And it give faster feedback to development team.

Here I am giving couple of example on how effectively we can perform API testing.

    1. Fixtures/Static files
    2. Mocking HTTP Calls in Cypress End-to-End Tests

Fixtures/Static files:
    
Unlike other API tools, Cypress supports data driven testing more effectively and hassle free using fixtures. Using fixtures, We can store test data in JSON file in cypress -> fixtures folder and read files in test files with no heavy code.

examples.json file:
        
        {
            "userName": "user_name",
            "psw": "password",
            "name": "Using fixtures to represent data",
            "email": "hello@cypress.io",
            "body": "Fixtures are a great way to mock data for responses to routes"
        }
    
Reading examples file in tests:

        cy.fixture('examples.json').as('test_data')
        (OR)
        fixture:examples.json in Requests

Mocking / Facking HTTP Calls in Cypress End-to-End Tests:
    
When we work in SHIFT-LEFT/ In-Sprint model, Dev and QA team must start testing at early stage to get quick feedback. Hence, it helps in delivering the features to production with great quality. Moreover, it speedup the release process. Also, it ensure quality is more of a Team activity.

Unit tests, integration tests, and end-to-end tests in particular are a way to safeguard against bugs popping up in seemingly unrelated pieces of code while you’re building out cool, new features.

But if your API/Web Application is anything like the one we build and support, it depends on external data sources from other teams, both within or outside of our organisation (3rd party API), we can’t always rely on that data (especially when it comes to non-production data) to be clean, accurate, or — in some cases, even in existence. This is why, when it comes to writing and running our unit, integration and end-to-end (e2e) tests (which are the tests that depend on external data), we mock (or “stub”) those API calls instead of hoping the stars align and no one else has changed that same data to suit their needs. 

Unreliable lower life cycle data, outside of the control of your development team, is no reason to keep new code from being merged in and deployed to production. But the old adage “It works on my machine” 🤷‍♀ is also not a valid justification because who knows that the same will hold true when deployed somewhere besides a local development laptop.

So let’s discuss how to cut out the (potentially) bad data and stub good data (the kind of data scenarios we’d expect to encounter in real life) when using Cypress for unit, integration and end-to-end testing for APIs.

We will perform below steps to do this activity.
    1. Need Cypress to be installed and to run tests
    2. Create new folder called (mock) and place all mocked response data files
    3. Nedd json-server plugin

    1. Install json-server:
    
        $npm install jason-server --save -dev
    
    It will take some time to install. Once it installed you can see some other files/code added to your folder.
        
    2. Create a new file & name it 'db.json' in fixtures (Note: we can create any number for fake JSON files)
        Put the JSON data you want to retrieve in your apps. I am pasting this data in db.json
        
    3. In package.json under “scripts” add below line/statement
            
        "scripts": {
            "json:server": "json-server",
        },

    4. Time to run the server. Write the command from terminal like below
        :VS Code - Terminal:
        $npm run json:server --watch cypress\fixtures\mock_responses\db.json //File path
        (OR)
        :Run from project Folder:
        C:\Work\Cypress\CypressProject>npm run json:server --watch cypress\fixtures\mock_responses\db.json

        db.json:

            {
                "users": [
                    {
                    "id": 1,
                    "name": "Jonas",
                    "surname": "T."
                    },
                    {
                    "id": 2,
                    "name": "Chris",
                    "surname": "B."
                    },
                    {
                    "id": 3,
                    "name": "Juliana",
                    "surname": "Crain"
                    },
                    {
                    "id": 4,
                    "name": "Caty",
                    "surname": "B."
                    },
                    {
                    "id": 5
                    },
                    {
                    "name": "Praveen",
                    "surname": "N.",
                    "id": 8
                    },
                    {
                    "name": "Praveen",
                    "surname": "Narala",
                    "id": 9
                    },
                    {
                    "name": "Praveen",
                    "surname": "Narala",
                    "id": 11
                    },
                    {
                    "name": "Praveen",
                    "surname": "Narala",
                    "id": 12
                    },
                    {
                    "name": "Praveen",
                    "surname": "Narala",
                    "id": 13
                    }
                ],
                "cartItemList": [
                    {
                    "id": 169,
                    "cartId": 44,
                    "productId": 123456,
                    "name": "test product",
                    "createdBy": "user_1",
                    "createdDate": 1573673984000,
                    "status": {
                        "id": 1,
                        "description": "Not yet purchased",
                        "label": "Purchase Pending"
                    }
                    },
                    {
                    "id": 32,
                    "cartId": 44,
                    "productId": 123457,
                    "name": "test product 2",
                    "createdBy": "user_1",
                    "createdDate": 1573494425000,
                    "status": {
                        "id": 1,
                        "description": "Not yet purchased",
                        "label": "Purchase Pending"
                    },
                    "statusId": 1
                    },
                    {
                    "id": 85,
                    "cartId": 44,
                    "productId": 123458,
                    "name": "test product 3",
                    "createdBy": "user_1",
                    "createdDate": 1573489773000,
                    "status": {
                        "id": 1,
                        "description": "Not yet purchased",
                        "label": "Purchase Pending"
                    },
                    "statusId": 1
                    }
                ]
            }

    5. The server should start on http://localhost:3000. Server uses 3000 as default port

    6. Once open user in browser, it will show all end points for mocked response
        
        Ex. /users & /cartItems
        
Note: These end points will work for all HTTP verbs/methods 'GET', 'PUT', 'POST', 'PATCH' and 'DELETE'
Some sample end ponts (base url: http://localhost:3000)

    1. /users -> Get all users
    2. /users/1 or /users?id=1 -> Query parameter to get specific user
    3. /users?q=J -> Get all matched record with name starts with character 'J'
    4. /users?_sort=name&_order=desc -> Sort respone using name

Working with multiple Mock files:

Above we have seen example of creating mock service for db.json file. But in real time, we will be interacting with multiple API services, so we may require multiple mocked json files to be loaded to perform Integration or e2e testing. 

It is easy to implement. Kinldy find below staps we should follow.

    1. Create multiple mocked JSON files in fixture folder. Refer previous example.
        Example files: cart_mock_data.json, db.json, test.json

    2. create db.json file in cypress/support/mock folder. And add code like below..

        module.exports = () => {
            return Object.assign({},
                    require('../../fixtures/mock_responses/test.json'),
                    require('../../fixtures/mock_responses/db.json'),
                    require('../../fixtures/mock_responses/cart_mock_data.json')
                );
            }
    
    3. Create server.js file inside cypress/support/mock folder. And add below code..

        const jsonServer = require('json-server');
        const server = jsonServer.create();
        const router = jsonServer.router(require('./db.js')());
        const middlewares = jsonServer.defaults();
        const port = process.env.PORT || 3000;

        server.use(middlewares);
        server.use(router);

        server.listen(port, () => {
            console.log('JSON Server is running')
        })

    4. Call server.js file in package.json file like below..
        
        "scripts": {
            "js:server": "node cypress/support/mocks/server.js"
        }

    5. Run command like below to run jason-server to load all mocked json files as end points
        
        :VS Code - Terminal:
        $node cypress/support/mocks/server.js (OR) $npm run js:server
        (OR)
        :Project Folder:
        C:\Work\Cypress\CypressProject>npm run js:server

Mocking Data using Faker:

faker.js is a JavaScript library for generating fake data. Fake data is useful when building and testing our application. The faker.js can generate fake data for various areas, including address, commerce, company, date, finance, image, random, or name.

Setting up faker.js:
        
        $npm install faker --save
        
Serving fake data with JSON Server:

        1. Create new file 'faker_generate_users.js' in cypress/support/mock folder
        2. Add add code as below..

            const faker = require('faker');
            const fs = require('fs')

            function generateUsers() {
            let users = []

            for (let id=1; id <= 100; id++) {

                let firstName = faker.name.firstName();
                let lastName = faker.name.lastName();
                let email = faker.internet.email();

                users.push({
                    "id": id,
                    "first_name": firstName,
                    "last_name": lastName,
                    "email": email
                });
            }

            return { "data": users }
            }

            let dataObj = generateUsers();

            fs.writeFileSync('cypress/fixtures/mock_responses/data.json', JSON.stringify(dataObj, null, '\t'));

        3. Run faker_generate_users.js as below
            $node cypress/support/mocks/faker_generate_users.js 

        4. Fake data will be generated dynamically '@cypress\fixtures\mock_responses\data.json'



    