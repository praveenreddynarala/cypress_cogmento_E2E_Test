import { naviagte_to_calendar, naviagte_to_calendar_new, create_new_event, validate_created_event, 
    edit_created_event, delete_created_event, manage_calendar, validate_updated_manage_calendar_value, naviagte_to_new_calendar } from "../../framework/pageObjects/calendar_page"
import { signin, verify_login_success } from "../../framework/pageObjects/openCRM_login_page"


describe('Calendar Events', () => {

    let testData

    before('Load test data from fixtures', () => {
        cy.fixture('example.json').then(($exampleData) => {
            testData = $exampleData
        })
    })

    beforeEach('Open Contacts screen', () => {
        cy.visit('/', {failOnStatusCode:false})
        cy.clearCookies()
        signin(testData.userName, testData.psw)
        verify_login_success('Praveen Narala')
    })

    it('Create new Event', () => {
        naviagte_to_calendar()
        naviagte_to_new_calendar()
        const created_event = create_new_event()
        validate_created_event(created_event)
        edit_created_event()
        delete_created_event()
    })

    it('Manage Calendar - Edit', () => {
        naviagte_to_calendar()
        manage_calendar()
        validate_updated_manage_calendar_value()
    })
})