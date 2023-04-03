import axios from "axios";
describe('welcome page', () => {
  beforeEach(function () {
    //cy.task('db:seed')
    // ...
  })
  it('successfully loads', () => {
    cy.visit('https://shapershifter.onrender.com') 
  })
  
  it('the user does an incomplete signup', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.get('form')
      cy.get('[id=sign-up-firstname]').type('John')
      cy.get('[id=sign-up-lastname]').type('Smith')
      cy.get('[id=sign-up-username]').type('smithy')
      cy.get('[id=sign-up-email]').type('john.smith@gmail.com')
      //.submit()
    cy.get('[value="Signup"]').click()
    cy.contains('div', 'Sign up error')
   // cy.should("contain", "Sign up error")
   

  })

  it('the user signs up for an account', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.get('form')
      cy.get('[id=sign-up-firstname]').type('John')
      cy.get('[id=sign-up-lastname]').type('Smith')
      cy.get('[id=sign-up-username]').type('smithy')
      cy.get('[id=sign-up-email]').type('john.smith@gmail.com')
      cy.get('[id=sign-up-password]').type('thisisapassword123')

    cy.get('[value="Signup"]').click()
    cy.contains('div', 'Sign up success')
  })


  it('the user logs in to an account', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.get('form')
      cy.get('[id=login-email]').type('john.smith@gmail.com')
      cy.get('[id=login-password]').type('thisisapassword123')


    cy.get('[value="Login"]').click()
    cy.contains('div', 'login success')
  })
  
})