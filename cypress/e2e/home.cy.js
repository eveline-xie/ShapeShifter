import axios from "axios";
describe('home page', () => {
  beforeEach(function () {
   // cy.request('DELETE', 'https://shapershifter.onrender.com', {firstname: 'John'})
  })

/*
  it('user signs up for an account', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.contains('Join').click()
      cy.get('[id=firstname]').type('John')
      cy.get('[id=lastname]').type('Smith')
      cy.get('[id=email]').type('john.smith@gmail.com')
      cy.get('[id=username]').type('smithy')

      cy.get('[id=password]').type('thisisapassword123')
      cy.get('[id=verified-password]').type('thisisapassword123')

    cy.get('button').contains('Create an Account').click()
    cy.url().should('include', '/login')
  })
  */



  it('the user edits region name', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In').click()
    cy.wait(3000)
    cy.get('[id=mapcards]').eq(0).contains('Edit').click()
    cy.contains('Edit Map Properties').click()
    cy.get('[id=my-map]').click(300, 180)
    cy.get('[aria-label=Rename]').click()
    cy.wait(6000)
    cy.get('textarea')
      .type('Here is new name', { force: true }).type('{enter}')
    cy.contains('Here is new name').should('exist')
    //cy.get('[id=mapcards]').eq(0).should('eq', 'USA States Map')
    //cy.get('#file-submit').click()
  })
  
  it('undo edit region name', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In').click()
    cy.wait(4000)
    cy.get('[id=mapcards]').eq(0).contains('Edit').click()
    cy.contains('Edit Map Properties').click()
    cy.get('[id=my-map]').click(300, 180)
    cy.get('[aria-label=Rename]').click()
    cy.wait(6000)
    cy.get('textarea')
      .type('Changed name', { force: true }).type('{enter}')
    cy.wait(2000)
    cy.get('[aria-label=Undo]').click()
    cy.contains('Here is new name').should('exist')
    //cy.get('[id=mapcards]').eq(0).should('eq', 'USA States Map')
    //cy.get('#file-submit').click()
  })
  
  it('user wants to view region properties', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In').click()
    cy.wait(4000)
    cy.get('[id=mapcards]').eq(0).contains('Edit').click()
    cy.contains('Edit Map Properties').click()
    cy.get('[id=my-map]').click(300, 180)
    cy.get('[aria-label="Subregion Properties"]').click()
    cy.wait(4000)
    cy.contains('X').should('exist')
    //cy.get('[id=mapcards]').eq(0).should('eq', 'USA States Map')
    //cy.get('#file-submit').click()
  })
  


  
})