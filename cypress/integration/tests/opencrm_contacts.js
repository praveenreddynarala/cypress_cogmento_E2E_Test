import { navigate_to_contacts, create_new_contact, validate_created_contact, page_toolbar_actions, delete_created_contact, validate_created_contact_got_deleted } from "../../framework/pageObjects/contacts_page";
import { global_search } from "../../framework/pageObjects/home_page";
import { signin, verify_login_success } from "../../framework/pageObjects/openCRM_login_page";

describe('Contacts Test Cases', () => {   
    
    let created_contact
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

    it('Create new Contact', () => {
        cy.visit('/contacts')
        created_contact = create_new_contact()
        cy.log(created_contact)
        global_search(created_contact)
        validate_created_contact(created_contact + ' Reddy Narala')
    })

    it('Delete created Contact', () => {
        global_search(created_contact)
        delete_created_contact(created_contact + ' Reddy Narala')
        page_toolbar_actions('Delete')
        global_search(created_contact)
        validate_created_contact_got_deleted(created_contact + ' Reddy Narala')
    })
})

