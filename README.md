RestAPI Testing with Cypress
    We like to pretend there are two adjointed end-to-end test types: API and browser automation tests. And that the tools used are very different. Most of the cases E2E tests we perform either in API or browser (client interface); but not mixing by both in signle solution. Yet, a good E2E automation test runner, in my opinion, should be really good at working with a remote server API via HTTP. After all, this is what every useful website does. Every website exchanges data with remote servers through HTTP requests.

    Cypress is the one tool which capable enough to solve both the problems in one single solution. Using Cypress we can perform E2E tests for any REST API's, and also perform E2E testing for both API & client interface (UI).

    When it comes to using Cypress, many users think about front-end testing. But we can use Cypress when writing e2e API tests. If there is, e.g., REST API created in our application, automated API tests should be an integral part of the application's e2e tests. Cypress allows us to write these two types of tests. It is undoubtedly convenient because everything is done using one tool and one programming language - JavaScript.

    In this paper, we will work with REST API - he REST acronym comes from the English words Representational State Transfer. It is a software architectural style in which we work with resources.

REST API testing - requirements
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

    - Go to cypress.json file and add the base URL that will be used in our test
        
    {
        "baseURL": "https://gorest.co.in"
    }

    Make a GET request call in beforeEach()..
    
    beforeEach(() => {
        cy.request({
            method: 'GET',
            url: '/api/users?page=2', 
            headers: {
                'accept': 'application/json'
            }
        }).as('users')
    })

    Call response in tests using alas name '@users'. Example..

    - Check GET respone Status Code:

    it('Check response code', () => {
        cy.get('@users')
        .its('status')
        .should('equal', 200)
    })

    - Check response content type:

    it('Check its conetent type',  () => {
        cy.get('@users')
        .its('headers')
        .its('content-type')
        .should('include', 'application/json; charset=utf-8')
    })

    - Log length of the response body:

    it('Get length of the response body', () => {
        cy.get('@users')
        .its('body')
        .its('data').then(data => {
            cy.log(data.length)
        })
    })

    - Match actual json response with expected json response using 'deep.equals'

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

    More GET Calls - Please refer test files


