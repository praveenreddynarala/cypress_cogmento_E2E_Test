

describe('Patch Update Calls', () => {
    
    beforeEach('Update record before each test', () => {
        cy.request({
            method: 'PUT',
            url: Cypress.env('reqres_url') + '/api/users/2',
            body: {
                "name": "morpheus",
                "job": "zion resident"
            },
            headers: {
                accept: 'application/json'
            }
        }).as('request')
    })
    
    it('Check status', () => {
        cy.get('@request').then(response => {
            cy.log(JSON.stringify(response))
            cy.log(JSON.stringify(response.headers))
            cy.log(JSON.stringify(response.body))
            cy.log(JSON.stringify(response.body.name))
            expect(response.status).equal(200)
        })
    })

    it('Check updated record using Should command', () => {
        cy.get('@request').its('body').should('include', {
            "name": "morpheus",
            "job": "zion resident"
          })
    })

    it('Check update record', () => {
        cy.get('@request').its('body').then(response => {
            expect(response).to.have.property('name', response.name)
            expect(response).to.have.property('job', response.job)
        })
    })
})