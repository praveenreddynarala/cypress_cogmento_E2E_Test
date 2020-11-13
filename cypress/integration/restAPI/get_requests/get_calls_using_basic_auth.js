
//#region Get calls using Basic Authentication
/**
 * Update "baseUrl": "https://api.github.com" in cypress.json fiel before run this test file
 */
describe('GET calls using Basic Authentication Tests', () => {

    beforeEach(() => {
        cy.request({
            method:'GET',
            url: Cypress.env('github_url')+'/user/repos',
            auth:{
                bearer: Cypress.env('github_bearer_token')
                // user: Cypress.env('auth_username'),
                // password: Cypress.env('auth_password')
            },
            headers:{
                'accept':'application/json'
            }
        }).as('request')
    })

    it('Get all repos', () => {
        cy.get('@request').then(($response) => {
            expect($response.status).equal(200)
            expect($response.body).to.be.not.null
            expect($response.body[0].name).equal('Appium')
            expect($response.body[0].owner.url).equal('https://api.github.com/users/praveenreddynarala')
        })
    })
})
//#endregion