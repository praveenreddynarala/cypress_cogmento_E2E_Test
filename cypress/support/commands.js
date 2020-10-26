// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

//Create element
Cypress.Commands.add('getElement', (locatorType, weblocator, timeout=10) => {
    if(locatorType === 'CSS'){
        cy.get(weblocator, {timeout: timeout}).then(($ele) => {
            return cy.wrap($ele)
        })
    }else{
        cy.xpath(weblocator).then(($ele) => {
            cy.wrap($ele)
        })
    }
})
// -- This will select an item from list control
Cypress.Commands.add('selectlistitem', (weblocator, option) => {
    cy.get(weblocator).each(($ele, index, $list) => {
        if($ele.text() === option){
            cy.wrap($ele).click()
        }
    })
})

//Get text on an element
Cypress.Commands.add('getText', (locatorType, weblocator, timeout=10) => {
    try {
        cy.getElement(locatorType, weblocator, timeout).should('be.visible').then(($text) => {
            return $text.text().trim()
        })
        // cy.get(weblocator, {timeout: timeout}).should('be.visible').then(($text) => {
        //     return $text.text().trim()
        // })
    } catch (error) {
        cy.log('Unable to get text from an element')
    }
    
})

//Click on Button using its name
Cypress.Commands.add('clickButtonUsingName', (buttonName, matchFlag=false) => {
    cy.get('button').contains(buttonName, {matchCase: matchFlag}).should('be.visible').click()
})

//Set value in Text Field
Cypress.Commands.add('setValue', (element_locator, value) => {
    cy.get(element_locator).should('be.visible').clear().type(value)
})

//Click element
Cypress.Commands.add('clickElement', (element_locator, timeout=10) => {
    try {
        cy.get(element_locator, {timeout: timeout}).should('be.visible').click()
    } catch (error) {
        cy.log('Unable to click element')
    }
})

//Click element
Cypress.Commands.add('clickElementUsingXPath', (element_locator, timeout=10) => {
    try {
        cy.xpath(element_locator, {timeout: timeout}).should('be.visible').click({force:true})
    } catch (error) {
        cy.log('Unable to click element')
    }
})

//Click element using time out
Cypress.Commands.add('clickElementForce', (element_locator, timeout=10) => {
    try {
        if(timeout != null){
            cy.get(element_locator, {timeout: timeout}).click({force:true})
        }
    } catch (error) {
        cy.log('Unable to click on element')
    }
})

//Click element multiple tiles using time out
Cypress.Commands.add('clickElementMultipleTimes', (locatorType, weblocator, timeout=10) => {
    try {
        cy.getElement(locatorType, weblocator, timeout).should('be.visible').click({multiple: true})
    } catch (error) {
        cy.log('Unable to click multiple times on element')
    }
})

//Generate random number
Cypress.Commands.add('random_num', (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
})