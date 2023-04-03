import axios from "axios";
describe('welcome page', () => {
  beforeEach(function () {
   // cy.request('DELETE', 'https://shapershifter.onrender.com', {firstname: 'John'})
  })
  it('successfully loads', () => {
    cy.visit('https://shapershifter.onrender.com') 
  })
  

  it('existing user signs up for an account', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
      cy.get('[id=sign-up-firstname]').type('John')
      cy.get('[id=sign-up-lastname]').type('Smith')
      cy.get('[id=sign-up-username]').type('smithy')
      cy.get('[id=sign-up-email]').type('john.smith@gmail.com')
      cy.get('[id=sign-up-password]').type('thisisapassword123')

    cy.get('[value="Signup"]').click()
    cy.contains('div', 'user exists')
  })


  it('the user logs in to an account', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
      cy.get('[id=login-email]').type('john.smith@gmail.com')
      cy.get('[id=login-password]').type('thisisapassword123')


    cy.get('[value="Login"]').click()
    cy.contains('div', 'login success')
  })

  it('the user wants to remember password', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
      cy.get('[id=remember-email]').type('john.smith@gmail.com')
      cy.get('[id=remember-username]').type('smithy')


    cy.get('[value="Remember Password"]').click()
    cy.contains('div', 'pass: thisisapassword123')
  })



  
})