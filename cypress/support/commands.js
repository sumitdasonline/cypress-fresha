Cypress.Commands.add('TestStep', {prevSubject: 'optional'}, (subject, stepDefinition) => {
    if (subject === undefined) {
        return cy.task('log', stepDefinition);
    }
    cy.task('log', stepDefinition);
    return cy.wrap(subject);
});

Cypress.Commands.add('createCustomer', (firstName, lastName, email) => {
    cy.request({
        method: 'POST',
        url: Cypress.env('apiEndpoint') + '/v2/customers',
        headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        },
        body: {
            data: {
                type: 'customer-create-requests',
                attributes: {
                    'first-name': firstName,
                    'last-name': lastName,
                    gender: '',
                    email: email,
                    'contact-number': null,
                    'additional-contact-number': null,
                    'birthday-day': null,
                    'birthday-month': null,
                    'birthday-year': null,
                    'enable-email-notifications': true,
                    'enable-sms-notifications': false,
                    'accepts-marketing-notifications': true,
                    'selected-language-code': '',
                    'marketplace-appointment-confirmation-enabled': true,
                    'is-changed': true
                },
                relationships: {
                    'referral-source': {
                        data: {
                            attributes: {
                                id: 13521
                            },
                            type: 'referral-source'
                        }
                    },
                    notes: {
                        data: [
                            {
                                attributes: {
                                    text: '',
                                    'display-note': true
                                },
                                type: 'note'
                            }
                        ]
                    },
                    addresses: {
                        data: []
                    }
                }
            }
        }
    }).then(response => {
        expect(response.status).to.eq(200)
        return response.body.data.id
    })
})


Cypress.Commands.add('deleteCustomer', (customerId) => {
    cy.request(
        {
            failOnStatusCode: false,
            method: 'DELETE',
            url: Cypress.env('apiEndpoint') + '/customers/' + customerId,
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            },
        }
    )
})

Cypress.Commands.add('customerSearch', () => {
    cy.request(
        {
            method: 'GET',
            url: 'https://partners-api-staging.dev.fresha.io/v2/customer-search?offset=0&limit=30&query=&genders=&customer-type=&sort-order=desc&sort-by=first-name',
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            },
        }
    ).then(response => {
        expect(response.status).to.eq(200)
        return response.body.data
    })
})