
/**
 * Update "baseUrl": "https://gorest.co.in" in cypress.json fiel before run this test file
 */
describe('GET calls using Barear Authentication Tests', () => {
    beforeEach(() => {
        cy.request({
            method:'GET',
            url: Cypress.env('gorest_url')+'/public-api/users',
            auth:{
                bearer: Cypress.env('bearer_token')
            },
            headers:{
                // Authorization: `Bearer ${Cypress.env('bearer_token')}`,
                'Content-type':'application/json'
            }
        }).as('request')
    })

    it('Check status code for all users', () => {
        cy.get('@request')
        .its('status').should('equal', 200)
    })
})

//#region Optional Query Parameters
describe('Optional Query Parameter tests', () => {
    beforeEach(() => {
        cy.request({
            method:'GET',
            url: Cypress.env('gorest_url')+'/public-api/users',
            qs:{
                'name':'Goswamee Acharya'
            },
            headers:{
                Authorization: `Bearer ${Cypress.env('bearer_token')}`,
                'Content-type':'application/json'
            }
        }).as('request1')
    })

    it('Check expected response', () => {
        cy.get('@request1')
        .its('body')
        .its('data').then(response => {
            expect(response[0].name).equal('Goswamee Acharya')
        })
    })
})
//#endregion