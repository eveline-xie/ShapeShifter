import axios from "axios";
describe('welcome page', () => {
  beforeEach(function () {
   // cy.request('DELETE', 'https://shapershifter.onrender.com', {firstname: 'John'})
  })
  it('successfully loads', () => {
    cy.visit('https://shapershifter.onrender.com') 
  })
  

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


  it('the user logs in to an account that does not exist', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.contains('Login').click()
      cy.get('[id=username]').type('john.smith@gmail.com')
      cy.get('[id=password]').type('thisisapassword123')


    cy.get('button').contains('Log In').click()
    //cy.get('button').contains('Login').click()
    cy.get('div').contains('Incorrect email/username or password!')
  })

  it.only('the user logs in to an account', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.contains('Login').click()
      cy.get('[id=username]').type('username')
      cy.get('[id=password]').type('password')


    cy.get('button').contains('Log In').click()
    //cy.get('button').contains('Login').click()
    cy.get('div').contains('Incorrect email/username or password!')
  })

  it('the guest user wants to view community', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.get('button').contains('Explore Our Community').click()
    cy.url().should('include', '/communityguest')
  })



  
})