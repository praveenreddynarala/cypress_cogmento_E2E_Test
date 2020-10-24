import { expect } from "chai";

const emailField = '[name="email"]';
const passField = '[name="password"]';
const loginBtn = '.ui.fluid.large.blue.submit.button';
const userNameLable = '.user-display';

export const signin = (username, password) => {
    cy.setValue(emailField, username)
    cy.setValue(passField, password)
    cy.clickElement(loginBtn)
}

export const verify_login_success = (expected_username) => {
    cy.getText('CSS', userNameLable, 8000).then((text) => {
        expect(text).to.eq(expected_username)
    })
}