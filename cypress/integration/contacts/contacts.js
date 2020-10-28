import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import { create_new_contact, delete_created_contact, page_toolbar_actions, validate_created_contact, validate_created_contact_got_deleted } from '../../framework/pageObjects/contacts_page'
import { global_search } from '../../framework/pageObjects/home_page'

let created_contact
When('user create new contact:', (dataTable) => {
    cy.log(dataTable.hashes())
    const userDetails = dataTable.hashes()
    for(const row of userDetails){
        created_contact = create_new_contact(row.FirstName, row.LastName, row.MiddleName, row.Category, row.Status, row.Description)
    }
})

Then('user should be able to validate created contact', () => {
    global_search(created_contact)
    validate_created_contact(created_contact + ' Reddy Narala')
})

When('user search for created contact', () => {
    global_search(created_contact)
})

When('user delete created contact', () => {
    delete_created_contact(created_contact + ' Reddy Narala')
    page_toolbar_actions('Delete')
})

Then('user should not be able to see deleted contact', () => {
    global_search(created_contact)
    validate_created_contact_got_deleted(created_contact + ' Reddy Narala')
})