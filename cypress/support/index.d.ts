/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
        /**
         * This will select an item from list control
         * @param weblocator 
         * @param option 
         */
        selectlistitem(weblocator:string, option:string): Chainable<any>
        /**
         * Get text on an element
         * @param locatorType 
         * @param weblocator 
         * @param timeout 
         */
        getText(locatorType:string, weblocator:string, timeout?:10): Chainable<any>
        /**
         * Set value in Text Field
         * @param element_locator 
         * @param value 
         */
        setValue(element_locator:string, value:string): Chainable<any>
        /**
         * Click on Button using its name
         * @param buttonName 
         * @param matchFlag 
         */
        clickButtonUsingName(buttonName:string, matchFlag?:false): Chainable<any>
        /**
         * Click element
         * @param weblocator 
         * @param timeout 
         */
        clickElement(weblocator:string, timeout?:10): Chainable<any>
        /**
         * Click element using XPath
         * @param weblocator 
         * @param timeout 
         */
        clickElementUsingXPath(weblocator:string, timeout?:10): Chainable<any>
        /**
         * Click element using time out
         * @param weblocator 
         * @param timeout 
         */
        clickElementForce(weblocator:string, timeout?:10): Chainable<any>
        /**
         * Click element multiple tiles using time out
         * @param locatorType 
         * @param weblocator 
         * @param timeout 
         */
        clickElementMultipleTimes(locatorType:string, weblocator:string, timeout?:10): Chainable<any>
        /**
         * 
         * @param min Generate random number
         * @param max 
         */
        random_num(min:number, max:number): Chainable<any>
    }
}