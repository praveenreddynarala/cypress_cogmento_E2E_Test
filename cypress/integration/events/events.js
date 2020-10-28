import { Then, When } from "cypress-cucumber-preprocessor/steps";
import { create_new_event, delete_created_event, edit_created_event, manage_calendar, validate_created_event, validate_updated_manage_calendar_value } from "../../framework/pageObjects/calendar_page";

let created_event

When('user create new event', () => {
    created_event = create_new_event()
})

Then('user should be in a position to see created event', () => {
    validate_created_event(created_event)
})

Then('user edit created event', () => {
    edit_created_event()
})

Then('user delete created event', () => {
    delete_created_event()
})

When('user update manages calendar {string}', (eventName) => {
    manage_calendar(eventName)
})

Then('user should be able to see updated manage calendar {string}', (eventName) => {
    validate_updated_manage_calendar_value(eventName)
})
