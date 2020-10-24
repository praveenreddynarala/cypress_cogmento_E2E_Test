import { expect } from "chai"
import { random_num } from "../utils/utils"

const headerText = '#dashboard-toolbar > .header'
const firstNameTxt = '[name="first_name"]'
const lastNameTxt = '[name="last_name"]'
const middleNameText = '[name="middle_name"]'
const companyTxt = '[name="company"]'
const companyTxtInput = '[name="company"] input'
const categoryTxt = '[name="category"]'
const statusInput = 'div[name="status"]'
const descriptionTxtArea = 'textarea[name="description"]'
const listField = 'div.visible.menu.transition > div';
const main_table_body = 'div.main-content  table > tbody > tr'

/**
 * Create new contact
 */
export const create_new_contact = () => {
    let firstName = 'Praveen' + random_num(1, 50)
    cy.clickButtonUsingName('New')
    cy.setValue(firstNameTxt, firstName)
    cy.setValue(lastNameTxt, 'Narala')
    cy.setValue(middleNameText, 'Reddy')
    cy.get(companyTxt).click().should('have.attr', 'aria-expanded', 'true')
    cy.setValue(companyTxtInput, 'Test' + random_num(1, 50))
    cy.clickElement(categoryTxt)
    cy.selectlistitem(listField, 'Affiliate')
    cy.clickElement(statusInput)
    cy.selectlistitem(listField, 'New')
    cy.setValue(descriptionTxtArea, 'Sample Description!')
    cy.get(firstNameTxt).then((ele) => {
        let firstName = Cypress.$(ele).val()
        cy.log(firstName)
    })
    cy.clickButtonUsingName('Save', false)
    return firstName
}

/**
 * Validate created contact
 * @param {*} expandedContact 
 */
export const validate_created_contact = (expandedContact) => {
    cy.wait(6000)
    cy.get(main_table_body).eq(0).should('be.visible').then(($row) => {
        cy.wrap($row).find('td:nth-child(2) > a').should('be.visible')
        .should('contain.text', expandedContact)
    })
}

/**
 * Validate created contact got selected
 * @param {*} expandedContact 
 */
export const validate_created_contact_got_deleted = (expandedContact) => {
    cy.wait(4000)
    cy.get(main_table_body).should('be.visible')
    .each(($row) => {
        cy.wrap($row).find('td').eq(1).should('not.contain.text', expandedContact)
    })
}

/**
 * Delete created contact
 * @param {String} expandedContact 
 */
export const delete_created_contact = (expandedContact) => {
    cy.wait(6000)
    cy.get(main_table_body).eq(0).should('be.visible').then(($row) => {
        cy.wrap($row).find('td:nth-child(2) > a').should('be.visible')
        .should('contain.text', expandedContact).click()
    })
}

const tools_bar_actionsBtns = 'div.item.view-page-toolbar button.button.icon:nth-child([INDEX])'
/**
 * Tool bar actions
 * @param {String} action 
 */
export const page_toolbar_actions = (action) => {
    cy.wait(6000)
    if(action === 'Delete'){
        // cy.get(tools_bar_actionsBtns.replace('[INDEX]', '12')).click({force: true})
        cy.clickElementForce(tools_bar_actionsBtns.replace('[INDEX]', '12'))
        cy.clickButtonUsingName('Delete')
    }
}