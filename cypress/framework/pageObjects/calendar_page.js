import { expect } from "chai";
import { random_num } from "../utils/utils";

const titleFiled = '[name="title"]';
const calendatListBox = '[name="calendar"]';
const enddatefield = '//label[text()="End Date"]/..//input';
const nextmonthbutton = '//button[text()="Next Month"]';
const datefield = '//div[text()="1"]'
const descriptonTxtField = '[name="description"]';
const categoryTextField = '[name="category"]';
const listField = 'div.visible.menu.transition > div';
const alldayCheckField = 'div.ui.toggle.checkbox';
const saveBtn = 'button.ui.linkedin.button';
const headerItem = '(//div[text()="Title"]/../..//p)[1]';
const edit_eventBtn = 'div.item.view-page-toolbar > a'
const delete_eventBtn = 'div.item.view-page-toolbar > button:last-child'
const confirm_msg = 'div.warning.message'
const delete_confirmBtn = 'button.ui.red.button'
const manage_calendarLink = '//*[text()="Manage Calendars"]'
const calander_manager_controls = 'div.right.floated.content > a:nth-child([INDEX])'
const manage_calendarTxtField = '[name="calendarName"]'

/**
 * Open Calendar screen
 */
export const naviagte_to_new_calendar = () => {
    cy.visit('/calendar/new')
}

/**
 * Open Calendar screen
 */
export const naviagte_to_calendar = () => {
    cy.visit('/calendar')
}

/**
 * Create new Event
 */
export const create_new_event = () => {
    const event_title = 'Praveen_Event_' + random_num(1, 10)
    cy.setValue(titleFiled, event_title)
    // cy.get(titleFiled).should('be.visible').type(event_title)
    cy.clickElement(calendatListBox)
    // cy.get(calendatListBox).should('be.visible').click()
    cy.clickElementForce('div.visible.menu.transition > div:nth-child(2)')
    // cy.get('div.visible.menu.transition > div:nth-child(2)').should('be.visible').click({force: true})
    cy.clickElementUsingXPath(enddatefield)
    // cy.xpath(enddatefield, {timeout: 10000}).click({force:true})
    cy.clickElementUsingXPath(nextmonthbutton)
    // cy.xpath(nextmonthbutton, {timeout: 10000}).should('be.visible').click()
    cy.clickElementMultipleTimes('XPATH', datefield)
    // cy.xpath(datefield).should('be.visible').click({ multiple: true })
    cy.setValue(descriptonTxtField, 'Test Description')
    // cy.get(descriptonTxtField).should('be.visible').type('Test Description')
    cy.clickElement(categoryTextField)
    // cy.get(categoryTextField).click()
    cy.selectlistitem(listField, 'Optional')
    cy.clickElement(alldayCheckField)
    // cy.get(alldayCheckField).click()
    cy.clickElement(saveBtn)
    // cy.get(saveBtn).click()
    return(event_title)
}

/**
 * Validate created event
 * @param {*} created_event 
 */
export const validate_created_event = (created_event) => {
    // cy.xpath(headerItem, {timeout: 40000}).should('be.visible').then(($event_title) => {
    //     expect($event_title.text()).to.eq(created_event)
    // })
    cy.getText('XPATH', headerItem, 40000).then((text) => {
        expect(text).to.eq(created_event)
    })
}

/**
 * Edit created event
 */
export const edit_created_event = () => {
    cy.clickElement(edit_eventBtn)
    // cy.get(edit_eventBtn).should('be.visible').click()
    cy.clickElement(alldayCheckField)
    // cy.get(alldayCheckField).should('be.visible').click()
    cy.clickElement(saveBtn)
    // cy.get(saveBtn).click()
}

/**
 * Delete created event
 */
export const delete_created_event = () => {
    cy.clickElement(delete_eventBtn, 10000)
    // cy.get(delete_eventBtn).should('be.visible').click()
    cy.get(confirm_msg).should('be.visible').then(($con_msg) => {
        expect($con_msg).exist
        cy.clickElement(delete_confirmBtn)
        // cy.get(delete_confirmBtn).click()
    })
}

/**
 * Manage Calendar
 */
export const manage_calendar = () => {
    cy.clickElementUsingXPath(manage_calendarLink, 10000)
    // cy.xpath(manage_calendarLink).should('be.visible').click()
    cy.get(calander_manager_controls.replace('[INDEX]', '3')).should('be.visible').first().click()
    cy.setValue(manage_calendarTxtField, 'Praveen Narala <praveenreddy.narala@gmail.com> 1')
    // cy.get(manage_calendarTxtField).should('be.visible').clear().type('Praveen Narala <praveenreddy.narala@gmail.com> 1')
    cy.clickButtonUsingName('Save')
    // cy.get('button').contains('Save', {matchCase: false}).click()
    cy.clickButtonUsingName('Close')
    // cy.get('button').contains('Close', {matchCase: false}).click()
}

/**
 * Validate updated manage calendar value
 */
export const validate_updated_manage_calendar_value = () => {
    cy.get('label').contains('Praveen Narala <praveenreddy.narala@gmail.com> 1').should('be.visible')
}