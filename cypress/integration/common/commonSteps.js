import { Before, Given } from "cypress-cucumber-preprocessor/steps";
import { signin, verify_login_success } from "../../framework/pageObjects/openCRM_login_page";

let testData

Before(() => {
    cy.fixture('example.json').then(($exampleData) => {
        testData = $exampleData
    })
})

Given('user login to applications', () => {
    cy.visit('/', {failOnStatusCode:false})
    cy.clearCookies()
    signin(testData.userName, testData.psw)
    verify_login_success('Praveen Narala')
})

Given('user navigate to {string} screen', (pageName) => {
    cy.visit('/'+pageName)
})