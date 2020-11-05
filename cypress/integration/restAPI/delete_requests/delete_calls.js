
describe('Delete Requests', () => {
    it(('Delete resource'), () => {
        cy.request({
            method: 'DELETE',
            url: Cypress.env('reqres_url') + '/api/users/2'
        }).then(response => {
            expect(response.status).equal(204)
        })
    })
})