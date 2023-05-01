// run npm test
const request = require("supertest"); // Import supertest
const server = require("./server") // Import the server object
const mongoose = require('mongoose')

beforeAll(done => {
    done()
  })

afterEach(done => { // afterEach function is provided by Jest and executes once all tests are finished
    server.close() // We close the server connection once all tests have finished
    done()
})

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
        //.expect(200)
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
          //.expect(200)
          // .expect((res) => {
          //     res.data.message = "Success"
          // })
          .end((err, res) => {
              if (err) return done(err);
             
              return done();
            });
      
          // Even more logic goes here
      });

      test("GET /auth/remember-password", (done) => {
        request(server)
          .get("/auth/remember-password")
          // .expect("Content-Type", /json/)
          .send({
            email: "stormy@stormy",
            username: "stormyiscute",
          })
          //.expect(200)
          // .expect((res) => {
          //     res.data.message = "Success"
          // })
          .end((err, res) => {
              if (err) return done(err);
             
              return done();
            });
      
          // Even more logic goes here
      });

      test("PUT /auth/change-password", (done) => {
        request(server)
          .put("/auth/change-password")
          // .expect("Content-Type", /json/)
          .send({
            username: "stormyiscute",
            password: "password",
            newPassword: "newpassword",
          })
          //.expect(200)
          // .expect((res) => {
          //     res.data.message = "Success"
          // })
          .end((err, res) => {
              if (err) return done(err);
             
              return done();
            });
      
          // Even more logic goes here
      });

      test("POST `/duplicate-map", (done) => {
        request(server)
          .post("`/duplicate-map")
          // .expect("Content-Type", /json/)
          .send({
            id: "1",
          })
          //.expect(200)
          // .expect((res) => {
          //     res.data.message = "Success"
          // })
          .end((err, res) => {
              if (err) return done(err);
             
              return done();
            });
      
          // Even more logic goes here
      });

      test("PUT `/publish-map`", (done) => {
        request(server)
          .put("`/publish-map`")
          // .expect("Content-Type", /json/)
          .send({
            id: "1",
          })
          //.expect(200)
          // .expect((res) => {
          //     res.data.message = "Success"
          // })
          .end((err, res) => {
              if (err) return done(err);
             
              return done();
            });
      
          // Even more logic goes here
      });

      afterAll( async () =>{
        await mongoose.connection.close()
    })
  });
