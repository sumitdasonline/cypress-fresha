import "../support/commands";

export function randomStringOf(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


export function deleteAllCustomers() {
    cy.customerSearch().each(($element) => {
        const id = $element.id
        cy.deleteCustomer(id)
    })
}


export function getAllCustomers() {
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
}

export function verifyAllCustomersExists(...customers) {
    let flag = customers.length
    cy.customerSearch().each(($data) => {
        const id = $data.id
        let pos = customers.indexOf(id)
        if (pos !== -1) {
            flag--
        }
    }).then(() => {
        expect(flag).to.eq(0)
    })
}

export function verifyOnlyOneExist(...customers) {
    let flag = customers.length
    cy.customerSearch().each(($data) => {
        const id = $data.id
        let pos = customers.indexOf(id)
        if (pos !== -1) {
            flag--
        }
    }).then(() => {
        expect(flag).to.eq(customers.length - 1)
    })
}