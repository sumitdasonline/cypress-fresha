declare namespace Cypress{

    interface Chainable<Subject> {

        /**
         * Creates client with the given name and email
         *
         * @param firstName
         * @param lastName
         * @param email
         * @return customerId chainable Object
         */
        createCustomer(firstName: string,lastName: string, email: string): Chainable<Subject>;

        /**
         * Deletes the given customer by customer id
         *
         * @param customerId
         */
        deleteCustomer(customerId: string);

        /**
         * Calls the Customer Search API to get a list of customers
         *
         * @return response data
         */
        customerSearch(): Chainable<object>;

        /**
         * Logs defined test step as Cypress task, so that it shows up for reference in console
         * @param stepDefinition
         */
        TestStep(stepDefinition: string): Chainable<Subject>;

    }
}