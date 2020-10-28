Feature: Open CRM Events

    Feature Description

    Background: Login to application
        Given user login to applications
        And user navigate to "calendar" screen

    Scenario: Create new Event
        Given user navigate to "calendar/new" screen
        When user create new event
        Then user should be in a position to see created event

    Scenario: Edit created Event
        Given user navigate to "calendar/new" screen
        When user create new event
        Then user edit created event

    Scenario: Delete created event
        Given user navigate to "calendar/new" screen
        When user create new event
        Then user delete created event

    Scenario Outline: Update Manage Calendar
        When user update manages calendar "<CalendarName>"
        Then user should be able to see updated manage calendar "<CalendarName>"

        Examples:
            | CalendarName                                     |
            | Praveen Narala <praveenreddy.narala@gmail.com> 1 |

