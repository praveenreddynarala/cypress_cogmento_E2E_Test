
//#region POST resource
/**
 * Update "baseUrl": "https://reqres.in/" in cypress.json fiel before run this test file
 */
describe('POST requests', () => {
    beforeEach(() => {
        cy.request({
            method:'POST',
            url: Cypress.env('reqres_url')+'/api/users',
            headers:{
                accept:'application/json'
            },
            body:{
                "name": "morpheus",
                "job": "leader"
            }
        }).as('request')
    })

    it('Check post status', () => {
        cy.get('@request').then(($response) => {
            expect($response.status).equal(201)
            cy.log(JSON.stringify($response.body))
            cy.log($response.body)
        })
    })

    
    it('Check post response body', () => {
        cy.get('@request')
        .its('body').then(expected => {
            cy.log(JSON.stringify(expected))
            cy.wrap(expected).should('include', {"name":"morpheus"})
        })
    })
})
//#endregion

//#region REGISTER - SUCCESSFUL
describe('REGISTER - SUCCESSFUL', () => {
    beforeEach(() => {
        cy.request({
            method:'POST',
            url: Cypress.env('reqres_url')+'/api/register',
            body:{
                "email": "eve.holt@reqres.in",
                "password": "pistol"
            }
        }).as('request')
    })

    it('Check Registration Successfull', () => {
        cy.get('@request').then(response => {
            expect(response.status).equal(200)
            cy.log(JSON.stringify(response.body))
        })
    })

    it('Check response body', () => {
        let actual_resp
        cy.fixture('post_reqres_response.json').then(actual => {
            actual_resp = actual
        })

        cy.get('@request').its('body').then(expected => {
            expect(expected).to.deep.equal(actual_resp)
        })
    })
})
//#endregion

//#region Missing required data from POST body checks
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
            expect(response.body).to.deep.equals({ error: 'Missing password' })
        })
    })
})
//#endregion