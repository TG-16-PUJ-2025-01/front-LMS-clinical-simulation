describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })

  it('should have a title', () => {
    cy.wait(1000)
    cy.visit('https://example.cypress.io')
    cy.title().should('include', 'Kitchen Sink')
    cy.wait(1000)
  })
})