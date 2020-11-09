
let created_resource_id
describe('Mock POST calls', () => {
    it('Create new resource', () => {
        cy.request({
            method: 'POST',
            url: Cypress.env('mock_url') + '/users',
            headers: {
                'Content-type':'application/json'
            },
            body: {
                "name": "Praveen",
                "surname": "Narala"
            }
        }).as('request')

        cy.get('@request').then(response => {
            if(response.status === 201){
                cy.log(response.body.id)
                created_resource_id = response.body.id
            }
        })
    })
    
    it('Delete created resource', () => {
        cy.request({
            method: 'DELETE',
            url: Cypress.env('mock_url') + '/users/' + created_resource_id,
            headers: {
                'Content-type':'application/json'
            }
        }).as('request')

        cy.get('@request').its('status').should('equal', 200)
    })
})