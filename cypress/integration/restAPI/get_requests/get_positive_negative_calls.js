
/**
 * Update "baseUrl": "https://reqres.in/" in cypress.json fiel before run this test file
 */
//#region GET positive tests
describe('Reqres.in API - Get Call Requests', () => {
    
    beforeEach(() => {
        cy.request({
            method: 'GET',
            url:  Cypress.env('reqres_url')+'/api/users?page=2', 
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

    it('Check its conetent type',  () => {
        cy.get('@users')
        .its('headers')
        .its('content-type')
        .should('include', 'application/json; charset=utf-8')
    })

    it('Get length of the response body', () => {
        cy.get('@users')
        .its('body')
        .its('data').then(data => {
            cy.log(data.length)
        })
    })

    it('Check length of the response body', () => {
        cy.get('@users')
        .its('body')
        .its('data')
        .should('have.length', 6)
    })

    it('Expect response body should not be null', () => {
        cy.get('@users')
        .its('body').should('not.be.null')
    })

    it('Check total pages in response', () => {
        cy.get('@users')
        .its('body')
        .its('total_pages').should('equal', 2)
    })

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

    it('Print complete response body as JSON string', () => {
        cy.get('@users')
        .its('body').then(($expected_response) => { 
            cy.log(JSON.stringify($expected_response))
        })
    })

    it('Check actual response body legth againist expected json response length', () => {
        cy.fixture('get_reqres_response.json').as('actual_response')
        
        let actual_resp
        cy.get('@actual_response').its('data')
        .then((actual) => {
          cy.log(`There are ${actual.length} admins.`)
          actual_resp = actual.length
        })

        cy.get('@users')
        .its('body').its('data').then(($expected_response) => {
            cy.log(JSON.stringify($expected_response))
            cy.log($expected_response.length)
            expect($expected_response).to.have.lengthOf(actual_resp)
        })
    })

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
})
//#endregion

//#region GET negative tests
describe('GET negative calls', () => {
    it('Single user not found', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('reqres_url')+'/api/users/23', 
            headers: {
                'accept': 'application/json'
            },
            failOnStatusCode:false //fail on status code if we remove this option or set to true
        }).then(($response) => {
            expect($response.status).equal(404)
        })
    })

    it('Single resource not found', () => {
        cy.request({
            method: 'GET',
            url: '/api/unknown/23', 
            headers: {
                'accept': 'application/json'
            },
            failOnStatusCode:false //fail on status code if we remove this option or set to true
        }).then(($response) => {
            expect($response.status).equal(404)
        })
    })
})
//#endregion

//#region 
describe('Check delayed response', () => {
    it('Delay Response', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('reqres_url')+'/api/users?delay=3', 
            headers: {
                'accept': 'application/json'
            },
            failOnStatusCode:false //fail on status code if we remove this option or set to true
        }).then(($response) => {
            expect($response.status).equal(200)
        })
    })
})
//#endregion