describe('GitHub E2E Test Workflow', () => {
    
    let new_repo_name = 'Hello-World'

    it('Create new repository', () => {
        cy.request({
            method: 'POST',
            url: Cypress.env('github_url') + '/user/repos',
            auth:{
                // bearer: Cypress.env('github_bearer_token')
                user: Cypress.env('auth_username'),
                password: Cypress.env('auth_password')
            },
            headers:{
                'Content-type':'application/json'
            },
            body: {
                "name": new_repo_name,
                "description": "This is your first repository",
                "homepage": "https://github.com",
                "private": false,
                "has_issues": true,
                "has_projects": true,
                "has_wiki": true
            }
        }).then(response => {
            expect(response.status).equal(201)
        })
    })

    it('Check created repository', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('github_url') + '/repos/praveenreddynarala/' + new_repo_name,
            auth:{
                // bearer: Cypress.env('github_bearer_token')
                user: Cypress.env('auth_username'),
                password: Cypress.env('auth_password')
            },
            headers:{
                'Content-type':'application/json'
            }
        }).then(response => {
            if(response.status === 200){
                cy.wrap(response).its('body').should('include', {"name": new_repo_name})
            }else{
                cy.log('No repository exists!' + response.status)
            }
        })
    })

    it('Get content of new repository', () => {
        cy.request({
            method: 'GET',
            url: Cypress.env('github_url') + '/repos/praveenreddynarala/'+ new_repo_name +'/contents',
            auth:{
                // bearer: Cypress.env('github_bearer_token')
                user: Cypress.env('auth_username'),
                password: Cypress.env('auth_password')
            },
            headers:{
                'Content-type':'application/json'
            },
            failOnStatusCode: false
        }).then(response => {
            if(response.status === 404){
                cy.wrap(response).its('body').should('include', {"message": "This repository is empty."})
            }else{
                cy.log('Failed to verify api request' + response.status)
            }
        })
    })

    let sha_code
    it('Create a file in repository', () => {
        cy.request({
            method: 'PUT',
            url: Cypress.env('github_url') + '/repos/praveenreddynarala/'+ new_repo_name +'/contents/README.md',
            auth:{
                // bearer: Cypress.env('github_bearer_token')
                user: Cypress.env('auth_username'),
                password: Cypress.env('auth_password')
            },
            body: {
                "message": "my first commit message",
                "committer": {
                    "name": "Praveen Reddy Narala",
                    "email": "praveenreddy.narala@gmail.com"
                },
                "content": "SGVsbG8sIFdvcmxk"
            }
        }).then(response => {
            if(response.status == 201){
                cy.wrap(response).its('body.content').should('include', {"name": "README.md"})
                cy.wrap(response).its('body.commit.author').should('include', {"name": "Praveen Reddy Narala"})
                cy.wrap(response).its('body.commit').should('include', {"message": "my first commit message"})
                cy.wrap(response).its('body.content.sha').then(sha => {
                    sha_code = sha
                })
            }
        })
    })

    it('Write content to READ.md file', () => {
        cy.request({
            method: 'PUT',
            url: Cypress.env('github_url') + '/repos/praveenreddynarala/'+ new_repo_name +'/contents/README.md',
            auth:{
                // bearer: Cypress.env('github_bearer_token')
                user: Cypress.env('auth_username'),
                password: Cypress.env('auth_password')
            },
            body: {
                "message": "my commit message",
                "committer": {
                    "name": "Monalisa Octocat",
                    "email": "octocat@github.com"
                },
                "content": "SGVsbG8gUG9zdG1hbi4gSG93IGRvIHlvdSBkbz8=",
                "sha": sha_code
            }
        }).then(response => {
            expect(response.status).equal(200)
            cy.wrap(response).its('body.content.sha').then(sha => {
                sha_code = sha
            })
        })
    })

    it('Delete READ.md file', () => {
        cy.request({
            method: 'DELETE',
            url: Cypress.env('github_url') + '/repos/praveenreddynarala/'+ new_repo_name +'/contents/README.md',
            auth:{
                // bearer: Cypress.env('github_bearer_token')
                user: Cypress.env('auth_username'),
                password: Cypress.env('auth_password')
            },
            body: {
                "message": "delete file",
                "committer": {
                    "name": "Praveen Reddy Narala",
                    "email": "praveenreddy.narala@gmail.com"
                },
                "sha": sha_code
            }
        }).then(response => {
            expect(response.status).equal(200)
            expect(response.body.content).to.be.null
        })
    })

    it('Make repository to private', () => {
        cy.request({
            method: 'PATCH',
            url: Cypress.env('github_url') + '/repos/praveenreddynarala/'+ new_repo_name,
            auth:{
                // bearer: Cypress.env('github_bearer_token')
                user: Cypress.env('auth_username'),
                password: Cypress.env('auth_password')
            },
            body: {
                "name": "Hello-World",
                "description": "This is your first repository",
                "homepage": "https://github.com",
                "private": true,
                "has_issues": true,
                "has_projects": true,
                "has_wiki": true
            }
        }).then(response => {
            expect(response.status).equal(200)
            expect(response.body.private).to.be.true
        })
    })

    it('Delete repository', () => {
        cy.request({
            method: 'DELETE',
            url: Cypress.env('github_url') + '/repos/praveenreddynarala/'+ new_repo_name,
            auth:{
                user: Cypress.env('auth_username'),
                password: Cypress.env('auth_password')
            }
        }).then(response => {
            expect(response.status).equal(204)
        })
    })

})