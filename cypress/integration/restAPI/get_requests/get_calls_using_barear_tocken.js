
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
                'Content-type':'application/json'
            }
        }).as('request')
    })

    it('Check status code for all users', () => {
        cy.get('@request')
        .its('status').should('equal', 200)
    })

    it('Check status code for all users', () => {
        cy.get('@request').then(response => {
            cy.writeFile('cypress/fixtures/save_responses/seved_response.json', response.body)
            cy.readFile('cypress/fixtures/save_responses/seved_response.json').then(json_data => {
                cy.log(json_data.code)
                expect(json_data.code).equal(200)
            })
        })
    })
})

//#region Optional Query Parameters
describe('Optional Query Parameter tests', () => {
    beforeEach(() => {
        cy.request({
            method:'GET',
            url: Cypress.env('gorest_url')+'/public-api/users',
            qs:{
                'id':'1'
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
            cy.log(JSON.stringify(response))
            expect(response[0].email).equal('bhagwanti_gowda@waelchi.org')
        })
    })
})
//#endregion