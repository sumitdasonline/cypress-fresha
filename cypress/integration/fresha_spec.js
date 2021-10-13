import login from "../support/page_selectors/login";
import leftPanel from "../support/page_selectors/leftPanel";
import clients from "../support/page_selectors/clients";
import "../support/commands";
import {deleteAllCustomers, randomStringOf, verifyAllCustomersExists, verifyOnlyOneExist} from "../support/functions"
import mergeDuplicates from "../support/page_selectors/mergeDuplicates";
import clientDrawer from "../support/page_selectors/clientDrawer";

require('cypress-xpath')

describe('fresha simple test', () => {
    before('Before Each', () => {
        cy.TestStep('Visit BaseURL')
            .visit('https://partners-staging.dev.fresha.io/')

        cy.TestStep('Enter email')
            .get(login.emailAddress)
            .type('rndmeml@gmail.com')
            .get(login.continue)
            .click()

        cy.TestStep('Enter Password')
            .get(login.password)
            .type('randompassword1234')
            .get(login.logIn).click()

    })

    it('Duplicated Client Banner', () => {

        let firstName = randomStringOf(5)
        let lastName = randomStringOf(5)
        let email = firstName + '@email.com'

        cy.intercept('GET', '/customer-duplicates/existence-check').as('customerDuplicateExistenceCheck')
        cy.intercept('GET', '/customer-avatars*').as('customerAvatarLoad')
        cy.intercept('GET', '/v2/customer-search*').as('customerSearch')


        cy.TestStep('Left Panel should be visible')
            .get(leftPanel.clients).should('be.visible')

        cy.TestStep('Create 2 duplicate customers via API')
            .createCustomer(firstName, lastName, email).as('customer1')
            .createCustomer(firstName, lastName, email).as('customer2')

        cy.TestStep('Navigate to Client page')
            .get(leftPanel.clients).click()
            .wait('@customerDuplicateExistenceCheck')
            .wait('@customerAvatarLoad')
            .wait('@customerSearch')
            .then(() => {
                cy.get('@customer1').then(($customer1) => {
                    cy.get('@customer2').then(($customer2) => {
                        verifyAllCustomersExists($customer1, $customer2)
                    })
                })
            })


        cy.TestStep('Wait for Client list to be visible').then(() => {
            cy.xpath(clients.clientListItems).should('be.visible')
        })


        cy.TestStep('User should see duplicate indicator')
            .get(clients.duplicateIndicator).should('be.visible')

        cy.TestStep('Click on Review and merge button')
            .get(clients.reviewAndMerge)
            .click()

        cy.TestStep('Validate the created email exists to be merged')
            .get(mergeDuplicates.form).should('exist')
            .get(mergeDuplicates.group)
            .invoke('text').should('contain', email)

        cy.TestStep('Merge duplicates with confirmation')
            .get(mergeDuplicates.merge).click()
            .get(mergeDuplicates.confirmMergeCheckbox).click()
            .get(mergeDuplicates.confirmAndMerge).click()

        cy.TestStep('Validate the success toast message is visible')
            .get(clients.toastMessage).should('be.visible')
        cy.TestStep('Validate duplicate message disappears')
            .get(clients.duplicateIndicator).should('not.exist')

        cy.TestStep('Validate one of the customers does not exist anymore')
            .get(clients.toastMessage).should('not.be.visible')
            .then(() => {
                cy.get('@customer1').then(($customer1) => {
                    cy.get('@customer2').then(($customer2) => {
                        verifyOnlyOneExist($customer1, $customer2)
                    })
                })
            })

        cy.TestStep('Reloading cause the Merged clients are not updating in FE')
            .reload()

        cy.TestStep('Open drawer for the merged client').then(() => {
            cy.xpath(clients.clientListItems)
                .filter(':contains("' + email + '")')
                .click()
                .get(clientDrawer.fullName)
                .should('be.visible')
        })

        cy.TestStep('Validate the client name and email')
            .get(clientDrawer.fullName)
            .invoke('text')
            .should('eq', firstName + ' ' + lastName)
            .get(clientDrawer.email)
            .invoke('text')
            .should('eq', email)

        cy.TestStep('Validate client details')
            .get(clientDrawer.clientDetails)
            .click()
            .get(clientDrawer.clientDetailsEmail)
            .should('be.visible')

        cy.TestStep('Delete All customers to avoid Test data explosion').then(() => {
            deleteAllCustomers()
        })
    })
})