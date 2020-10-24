const global_searchBtn = '.ui.transparent.inverted.input>input:nth-child(1)'

/**
 * Global search
 * @param {*} searchTxt 
 */
export const global_search = (searchTxt) => {
    cy.get(global_searchBtn).should('have.attr', 'placeholder', 'Search').then(($ele) => {
        cy.wrap($ele).clear().type(searchTxt+ '{enter}')
    })
}
