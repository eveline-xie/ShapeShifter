import axios from "axios";
describe('welcome page', () => {
  beforeEach(function () {
   // cy.request('DELETE', 'https://shapershifter.onrender.com', {firstname: 'John'})
  })
  it('successfully loads', () => {
    cy.visit('https://shapershifter.onrender.com') 
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

/*
  it('the user logs in to an account wrong', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword1234')


    cy.get('button').contains('Log In').click()
    //cy.get('button').contains('Login').click()
    cy.get('div').contains('Incorrect email/username or password!')
  })
*/

it('user goes to sign up page', () => {
  cy.visit('https://shapershifter.onrender.com')
  cy.contains('Join').click()
  cy.url().should('include','/signup')
})

it('user goes to login page', () => {
  cy.visit('https://shapershifter.onrender.com')
  cy.contains('Login').click()
  cy.url().should('include','/login')
})

  it.only('the user logs in to an account', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')


    cy.get('button').contains('Log In').click()
    //cy.get('button').contains('Login').click()
    //cy.url().should('include', '/login')
    cy.url().should('include', '/home')
  })

  it.only('the user uploads a new map', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login')
      .click()
    cy.get('[id=username]').type('smithy')
    cy.get('[id=password]').type('thisisapassword123')
    cy.get('button')
      .contains('Log In')
      .click().wait(4000)
    //cy.get('[id=create-map]').children()
    cy.contains('SHP').click()
      cy.get('input[type=file]').first().selectFile('cypress/fixtures/USA_adm1.shp', {force: true}).wait(200)
    //cy.get('[id=create-map]').children()
    cy.contains('DBF').click()
    cy.get('input[type=file]').last().selectFile('cypress/fixtures/USA_adm1.dbf', {force: true}).wait(200)
    //cy.get('#file-submit').click()
  })

/*
  it('the user deletes map', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In').click()
    cy.get('[id=mapcards]').eq(0).contains('Delete').click()
    cy.get(['id=delete-modal']).get('button').contains('Confirm').click()
    //cy.get('#file-submit').click()
  })
  */
/*
  it('the logged in user wants to view community', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In')
      .click()
    cy.contains('Community').click()
    cy.get('[id=mapcards]').eq(0).contains('View').click()
    
  })
*/


  it('the guest user wants to view community', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.get('button').contains('Explore Our Community').click()
    cy.url().should('include', '/communityguest')
  })

  it('the guest user cannot access home', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.get('button').contains('Explore Our Community').click()
    cy.get('Home').should('not.exist');
  })



  
})