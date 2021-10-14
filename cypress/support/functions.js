import "../support/commands";

/**
 * Generate a random String
 * @param length
 * @return Random String
 */
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

/**
 * Delete all customers
 */
export function deleteAllCustomers() {
    cy.customerSearch().each(($data) => {
        cy.deleteCustomer($data.id)
    })
}

/**
 * Verify if the given customers exists in Customer search API response
 * @param customers Array of customers
 */
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
//TODO: Simplify these 2 functions
/**
 * Verify if one of the given customers got merged into another by verifying that only one exists among two (Duh!)
 * @param customers Array of customers
 */
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