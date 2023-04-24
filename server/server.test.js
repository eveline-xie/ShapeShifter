// run npm test
const request = require("supertest"); // Import supertest
const server = require("./server"); // Import the server object
const mongoose = require("mongoose");
const {
  default: HomeScreen,
} = require("./ShapeShifter/client/src/components/screens/HomeScreen");

beforeAll((done) => {
  done();
});

afterEach((done) => {
  // afterEach function is provided by Jest and executes once all tests are finished
  server.close(); // We close the server connection once all tests have finished
  done();
});

describe("Auth Tests", () => {
  test("POST /auth/signup", (done) => {
    request(server)
      .post("/auth/signup")
      // .expect("Content-Type", /json/)
      .send({
        firstName: "Stormyyyyy",
        lastName: "Stormyyyy",
        username: "stormyiscute",
        email: "eveline.yang.xie@gmail.com",
        password: "password",
        passwordVerify: "password",
      })
      // .expect(200)
      // .expect((res) => {
      //   res.data.message = "Success";
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
        password: "password",
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

  test("PUT /auth/updatepassword", (done) => {
    request(server)
      .put("/auth/updatepassword")
      // .expect("Content-Type", /json/)
      .send({
        username: "stormyiscute",
        password: "password",
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

  test("GET /auth/user", (done) => {
    request(server)
      .get("/auth/user")
      // .expect("Content-Type", /json/)
      .send({
        email: "stormy@stormy",
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

  test("GET /load-user-maps-no-geojson", (done) => {
    request(server)
      .get("/load-user-maps-no-geojson")
      // .expect("Content-Type", /json/)
      .send({
        userId: "643ca30a841c13d1ed5f04d6",
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

  test("GET /load-user-maps-no-geojson", (done) => {
    request(server)
      .get("/load-user-maps-no-geojson")
      // .expect("Content-Type", /json/)
      .send({
        userId: "643ca30a841c13d1ed5f04d6",
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

  test("GET /load-user-maps", (done) => {
    request(server)
      .get("/load-user-maps")
      // .expect("Content-Type", /json/)
      .send({
        userId: "643ca30a841c13d1ed5f04d6",
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

  test("GET /map/:id", (done) => {
    request(server)
      .get("/map/643c0face5b6c7bbe08d1c89")
      // .expect("Content-Type", /json/)
      //  .send({
      //    userId: "643ca30a841c13d1ed5f04d6",
      //  })
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

  test("DELETE /map/:id", (done) => {
    request(server)
      .delete("/map/643c0face5b6c7bbe08d1c89")
      // .expect("Content-Type", /json/)
      //  .send({
      //    userId: "643ca30a841c13d1ed5f04d6",
      //  })
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

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
