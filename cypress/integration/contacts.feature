Feature: Open CRM Contacts

    Background: Login to application
        Given user login to applications

    Scenario: Create new contact
        Given user navigate to "contacts" screen
        When user create new contact:
            | FirstName | LastName | MiddleName | Category  | Status | Description         |
            | Praveen   | Narala   | Reddy      | Affiliate | New    | Sample Description! |
        Then user should be able to validate created contact

    Scenario: Deleted created contact
        And user search for created contact
        And user delete created contact
        Then user should not be able to see deleted contact
