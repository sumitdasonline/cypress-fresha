declare namespace Cypress{

    interface Chainable<Subject> {
        createCustomer(firstName: string,lastName: string, email: string);

        deleteCustomer(customerId: string);

        customerSearch(): Chainable<object>;

        TestStep(stepDefinition: string): Chainable<Subject>;

    }
}