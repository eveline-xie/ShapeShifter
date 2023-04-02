const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseURL: 'https://shapeshifter-api.onrender.com',
    //baseUrl: 'http://10.245.200.126:3000',
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        async 'db:seed'() {
          // Send request to backend API to re-seed database with test data
          const { data } = await axios.post(`${baseUrl}/test/users`)
          return data
        },
        //...
      })
    },
  },
});
