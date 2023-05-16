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


  it('the user logs in to an account that does not exist', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword1234')


    cy.get('button').contains('Log In').click()
    //cy.get('button').contains('Login').click()
    cy.get('div').contains('Can not find user')
  })

  it('the user logs in to an account wrong', () => {
    cy.visit('https://shapershifter.onrender.com')
    //cy.get('form')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword1234')


    cy.get('button').contains('Log In').click()
    //cy.get('button').contains('Login').click()
    cy.get('div').contains('Wrong username or password.')
  })


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

it('user goes to signup from login page', () => {
  cy.visit('https://shapershifter.onrender.com')
  cy.contains('Login').click()
  cy.contains('Need an account? Sign up now!').click()
  cy.url().should('include','/signup')
})

  it('the user logs in to an account', () => {
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

  it('the user uploads a new map', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login')
      .click()
    cy.get('[id=username]').type('smithy')
    cy.get('[id=password]').type('thisisapassword123')
    cy.get('button')
      .contains('Log In')
      .click()
    //cy.wait(2000)
    //cy.get('[id=create-map]').children()
    cy.contains('SHP').click()
      cy.get('input[type=file]').eq(0).selectFile('cypress/fixtures/USA_adm1.shp', {force: true})
      cy.wait(3000)
    //cy.get('[id=create-map]').children()
    cy.contains('DBF').click()
    cy.get('input[type=file]').eq(1).selectFile('cypress/fixtures/USA_adm1.dbf', {force: true})
    cy.wait(3000)
    //cy.wait(4000)
    //cy.url().should('include', '/createmap')
    //cy.get('#file-submit').click()
  })
  it('the user edits map', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In').click()
    cy.wait(3000)
    cy.get('[id=mapcards]').eq(0).contains('Edit').click()
    cy.contains('Edit Map Properties').click()
    //cy.get('[id=mapcards]').eq(0).should('eq', 'USA States Map')
    //cy.get('#file-submit').click()
  })
  it('the user renames map', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In').click()
    cy.wait(3000)
    cy.get('[id=mapcards]').eq(0).contains('Edit').click()
    cy.get('[name=Name]').clear()
    cy.get('[name=Name]').type('USA States Map')
    cy.contains('Save').click()
    //cy.get('[id=mapcards]').eq(0).should('eq', 'USA States Map')
    //cy.get('#file-submit').click()
  })

  it('the user adds a collaborator that does not exist', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In').click()
    cy.wait(3000)
    cy.get('[id=mapcards]').eq(0).contains('Edit').click()
    //cy.get('[name=Name]').clear()
    cy.get('[name="Invite Collaborators"]').type('thisisnotauser@gmail.com').type('{enter}')
    cy.get('div').contains('thisisnotauser@gmail.com is not registered.')
    //cy.get('[id=mapcards]').eq(0).should('eq', 'USA States Map')
    //cy.get('#file-submit').click()
  })

  it('the user deletes map', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In').click()
    cy.wait(6000)
    //cy.wait(12000)
    cy.get('[id=mapcards]').eq(0).contains('Delete').click()
    
    cy.get(['id=delete-modal']).get('button').contains('Confirm').click()
    //cy.get('#file-submit').click()
  })
  

  it('the logged in user wants to view community', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In')
      .click()
    cy.contains('Community').click()
    cy.url().should('include', '/community')
    
  })

  it('the logged in user wants to view community maps', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In')
      .click()
    cy.contains('Community').click()
    cy.get('[id=mapcards]').eq(0).contains('View').click()
    cy.contains('X').should('exist');
  })

  it.only('the logged in user wants to search in community maps', () => {
    cy.visit('https://shapershifter.onrender.com')
    cy.contains('Login').click()
      cy.get('[id=username]').type('smithy')
      cy.get('[id=password]').type('thisisapassword123')
    cy.get('button').contains('Log In')
      .click()
    cy.contains('Community').click()
    cy.get('[id=search-bar]').type("Untitled")
    cy.contains('Untitled').should('exist');
  })


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