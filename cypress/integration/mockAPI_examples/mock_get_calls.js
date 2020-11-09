//#region Generic tests
describe('Testing mock API', () => {
    beforeEach(() => {
        cy.request({
            method: 'GET',
            url: Cypress.env('mock_url') + '/users'
        }).as('request')
    })
    
    it('Check status code', () => {
        cy.get('@request').then(response => {
            expect(response.status).equal(200)
            cy.log(JSON.stringify(response.headers))
        })
    })

    it('Get all users', () => {
        cy.get('@request')
        .its('body').then(response => {
            cy.log(JSON.stringify(response[1]))
            expect(response[1]).deep.equal({"id":2,"name":"Chris","surname":"B."})
        })
    })
})
//#endregion

//#region Query parameters
describe('Test Query parameters', () => {
    it('Get user details based on ID', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('mock_url') + '/users/1',
            headers: {
                'Content-type':'application/json'
            }
        }).as('request')

        cy.get('@request').its('status').should('equal', 200)
        cy.get('@request').its('body').then(response => {
            cy.log(JSON.stringify(response))
            expect(response).deep.equal({"id":1,"name":"Jonas","surname":"T."})
        })
    })

    it('Get user using mached characters of name field/Text search', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('mock_url') + '/users?q=J',
            headers: {
                'Content-type':'application/json'
            }
        }).as('request')

        cy.get('@request').its('body').then(response => {
            response.forEach(element => {
                expect(element.name).to.be.contains('J')
            });
        })
    })

    it('Get user using pagination and limit', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('mock_url') + '/users?_page=1&_limit=1',
            headers: {
                'Content-type':'application/json'
            }
        }).as('request')

        cy.get('@request').its('body').then(response => {
            expect(response.length).to.be.equal(1)
        })
    })
})
//#endregion
