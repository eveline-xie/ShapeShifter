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
        .send({
          firstName: "Stormyyyyy",
          lastName: "Stormyyyy",
          username: "stormyiscute",
          email: "stormy@stormy",
          password: "password"
        })
        .end((err, res) => {
            if (err) return done(err);     
            return done();
          });
    
    });

    test("POST /auth/login", (done) => {
        request(server)
          .post("/auth/login")
          .send({
            email: "stormy@stormy",
            password: "password"
          })
          .end((err, res) => {
              if (err) return done(err);          
              return done();
            });
          });

      test("GET /auth/remember-password", (done) => {
        request(server)
          .get("/auth/remember-password")
          .send({
            email: "stormy@stormy",
            username: "stormyiscute",
          })
          .end((err, res) => {
              if (err) return done(err);        
              return done();
            });
      
      });

      test("PUT /auth/change-password", (done) => {
        request(server)
          .put("/auth/change-password")
          .send({
            username: "stormyiscute",
            password: "password",
            newPassword: "newpassword",
          })
          .end((err, res) => {
              if (err) return done(err);   
              return done();
            });
      });

          test("PUT /auth/update-password", (done) => {
            request(server)
              .put("/auth/update-password")
              .send({
                username: "stormyiscute",
                password: "password",
              })
              .end((err, res) => {
                if (err) return done(err);
                return done();
              });
          });

      test("POST /map", (done) => {
        request(server)
          .post("/map")
          .send({
            id: "1",
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });

      test("POST /duplicate-map", (done) => {
        request(server)
          .post("/duplicate-map")
          .send({
            id: "1",
          })
          .end((err, res) => {
              if (err) return done(err);  
              return done();
            });
      });

      test("PUT /publish-map", (done) => {
        request(server)
          .put("/publish-map")
          .send({
            id: "1",
          })
          .end((err, res) => {
              if (err) return done(err); 
              return done();
            });
      });

      test("DELETE /map", (done) => {
         request(server)
           .delete("/map")
           .send({
             id: "1",
           })
           .end((err, res) => {
             if (err) return done(err);
             return done();
           });
      });

      test("GET /load-published-maps", (done) => {
         request(server)
           .get("/load-published-maps")
           .end((err, res) => {
             if (err) return done(err);
             return done();
           });
      });

      test("GET /load-guest-published-maps", (done) => {
        request(server)
          .get("/load-published-maps")
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });

      test("GET /load-shared-maps", (done) => {
        request(server)
          .get("/load-shared-maps")
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });

      test("PUT /remove-shared-map", (done) => {
        request(server)
          .put("/remove-shared-map")
          .send({
            id: "1",
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });

      test("PUT /update-map-comments", (done) => {
        request(server)
          .put("/update-map-comments")
          .send({
            payload: {
              mapid: "1",
              comments: "hi"
            },
          })
          .end((err, res) => {
            if (err) return done(err);
            return done();
          });
      });

       test("GET /load-comments", (done) => {
         request(server)
           .get("/load-comments`")
           .end((err, res) => {
             if (err) return done(err);
             return done();
           });
       });

      afterAll( async () =>{
        await mongoose.connection.close()
    })
  });
