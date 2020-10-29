Setup Cypress:

    System Requirements:
        1. Windows 7 or above
        2. macOS 10.9 and above (64-bit only)
        3. Linux Ubuntu 12.04 and above, Fedora 21 and Debian 8 (64-bit only)

    Node.js:
        1. Node.js 10 or 12 and above
    
    Visual Studio Code:
        1. Install Visual Studio Code

    Install Cypress via npm:
        1. cd /your/project/path
        2. npm init
        3. npm install cypress --save-dev
        (OR)
        1. cd /your/project/path
        2. run 'code .' and enter. It will launch Visual Studio Code IDE 
        3. In Terminal -> run npm install cypress --save-dev


    Setting baseUrl:
    
        cypress.json -> add "baseUrl":"https://www.google.com/"

    Enable IntelliSense:
    
        IntelliSense is available for Cypress. jsconfig.json
            {
            "include": [
                "./node_modules/cypress",
                "cypress/**/*.js"
                ]
            }

    Enabel IntelliSense for Custome Commands (support/Commands.js):

        1. Create all custome commands in support/commands.js file
        2. Create index.d.ts file in support/index.d.ts (this is an interface)
            a. Add Cupress reference /// <reference types="cypress" />
            b. declare namspace and interface like..
            
                declare namespace Cypress {
                    interface Chainable<Subject> {
                        /**
                        * This will select an item from list control
                        * @param weblocator 
                        * @param option 
                        */
                        selectlistitem(weblocator:string, option:string): Chainable<any>
                    }
                }
        
        3. Create tsconfig.json file at project root level. Add below code..
            
            {
                "compilerOptions": {
                "lib": ["es2015", "dom"],
                "allowJs": true,
                "noEmit": true,
                "types": [
                    "cypress"
                ]
                },
                "include": [
                    "./node_modules/cypress",
                    "cypress/**/*.js",
                    "cypress/**/*.d.ts" //index.d.ts -> This will enable intellisence in all specs for custom commands
                ]
            }
        
        Important/Note: Please remove tsconfig.json file from project root folder. Otherwise tsconfig.json file does not work.



    Run Tests in different browsers:
        
        1. Run cmd -> cypress run --browser chrome/firefox/electron
        or
        1. We can set in package.json
        // "cy:run:chrome": "cypress run --browser chrome",
        // "cy:run:firefox": "cypress run --browser firefox"

    Run in Headless mode (cmd):
        
        1. $ cy:run --headless --browser chrome

    Run in parallel:
        
        1. $ cypress run --record --parallel

    Run tests specifying a single test file to run instead of all tests:
        
        1. $ cypress run --spec "cypress/integration/examples/actions.spec.js"
        2. .\node_modules\.bin\cypress run --browser chrome --record --key e2ccadb8-bf34-47bb-852b-9fe78e387d57 --headless

    Run tests specifying multiple test files to run:
        
        1. $ cypress run --spec "cypress/integration/examples/actions.spec.js,cypress/integration/examples/files.spec.js"

    Enable XPATH: (GITHUB path -> https://github.com/cypress-io/cypress-xpath)
    
        1. Install npm install -D cypress-xpath
        2. Then include in your project's cypress/support/index.js -> require('cypress-xpath')

    Enable Cucumber:
    
    Configuration:
    
    1. Install npm install --save-dev cypress-cucumber-preprocessor
    2. To enable usage of Cucumber in the Cypress automation framework, we need to make some configurations in below 3 files..
        
        a. plugins/index.js
        b. cypress.json
        c. package.json
        
        index.js: 1. The first file (shown by marker 1) is the “index.js” file under the plugins folder. We need to make the following changes in the “index.js” file, which exports Cucumber as a module and make it accessible in other Cypress files.
            
            const cucumber = require('cypress-cucumber-preprocessor').default
            
            module.exports = (on, config) => {
                on('file:preprocessor', cucumber())
            }

        cypress.json:
            
            Add below lines consider only .feature extension files
            "testFiles": "**/*.{feature,features}",
            "ignoreTestFiles": "**/*.{js,ts}"
        
        package.json:
         
            Add "cypress-cucumber-preprocessor": {
                    "nonGlobalStepDefinitions": true
                } //Here we need to specify the configuration that non-global step definitions are allowed, which means that step definitions can exist in sub-folders as well.
        
        Recommended Reference: https://wanago.io/2020/01/13/javascript-testing-cypress-cucumber/

    Creating Feature and step definition files:
    Feature File:
        1. Always feature files should be created in 'integration' folder
            Example: integration\event.feature, integration\contact.feature
    Step Definition Files:
        1. Always create folder based on feature file name in 'integration' folder
            Example: integration\event\event_steps.js, integration\contact\contact_steps.js
        Note: Folder structure should not change
    Common/Global/Repeated Test Step Files:
        1. Create common folder inside 'integration' folder
            Example: integration\common\common_steps.js

    Cucumber Hooks:
        1. Cucumber has two main Hooks
            a. Before
            b. After
        Before: This will execute before all scenrios. We can also create tagged Hooks.
            Example: Before(() => {

            })
            Example: Before({ tags: "@foo" }, () =>  {

            })
        After: This will execute after all scenarios execution. We can also create tagged hooks. Tagged hooks will works based on Scenrio tags.
            Example: After(() => {

            })
            Example: After({ tags: "@foo" }, () =>  {

            })
        Note: We can also use Cypress Hooks as well in cucumber

    Parameterization in Cucumber Scenarios:
        1. Data Table ->
            Example Scenario:
                Scenario: Create new contact
                Given user navigate to "contacts" screen
                When user create new contact:
                    | FirstName | LastName | MiddleName | Category  | Status | Description         |
                    | Praveen   | Narala   | Reddy      | Affiliate | New    | Sample Description! |
                Then user should be able to validate created contact
            
            Example Steps:
                let created_contact //Global variable
                When('user create new contact:', (dataTable) => {
                    cy.log(dataTable.hashes())
                    const userDetails = dataTable.hashes()
                    for(const row of userDetails){
                        created_contact = create_new_contact(row.FirstName, row.LastName, row.MiddleName, row.Category, row.Status, row.Description)
                    }
                })
        
        2. Examples ->
        Example Scenario Ouline:
            Scenario Outline: Update Manage Calendar
            When user update manages calendar "<CalendarName>"
            Then user should be able to see updated manage calendar "<CalendarName>"

            Examples:
                | CalendarName                                     |
                | Praveen Narala <praveenreddy.narala@gmail.com> 1 |
        
        Example Steps:
            When('user update manages calendar {string}', (eventName) => {
                manage_calendar(eventName)
            })

    Backgroung:
        Example:
            Background: Login to application
            Given user login to applications
            And user navigate to "calendar" screen
    
    Enabel Cucumber JSON Report:
        The cypress-cucumber-preprocessor can generate a cucumber.json file output as it runs the features files. This is separate from, and in addition to, any Mocha reporter configured in Cypress.
        Output, by default, is written to the folder cypress/cucumber-json, and one file is generated per feature.
        Add the following to the cypress-cucumber-preprocessor section in package.json to turn it off or change the defaults:
            "cypress-cucumber-preprocessor": {
                "cucumberJson": {
                "generate": true,
                "outputFolder": "cypress/cucumber-json",
                "filePrefix": "",
                "fileSuffix": ".cucumber"
                }
            }