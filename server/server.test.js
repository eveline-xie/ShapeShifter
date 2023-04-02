const request = require("supertest"); // Import supertest
const server = require("./server") // Import the server object

// afterEach(done => { // afterEach function is provided by Jest and executes once all tests are finished
//     server.close() // We close the server connection once all tests have finished
//     done()
// })

describe("Auth Tests", () => {
    test("POST /auth/signup", (done) => {
      request(server)
        .post("/auth/signup")
        // .expect("Content-Type", /json/)
        .send({
          firstName: "Stormyyyyy",
          lastName: "Stormyyyy",
          username: "stormyiscute",
          email: "stormy@stormy",
          password: "password"
        })
        .expect(200)
        // .expect((res) => {
        //     res.data.message = "Success"
        // })
        .end((err, res) => {
            if (err) return done(err);
           
            return done();
          });
    
        // Even more logic goes here
    });

    test("POST /auth/login", (done) => {
        request(server)
          .post("/auth/login")
          // .expect("Content-Type", /json/)
          .send({
            email: "stormy@stormy",
            password: "password"
          })
          .expect(200)
          // .expect((res) => {
          //     res.data.message = "Success"
          // })
          .end((err, res) => {
              if (err) return done(err);
             
              return done();
            });
      
          // Even more logic goes here
      });
  });
