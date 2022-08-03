const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");

const path = require("path");

require("dotenv").config();

const Task = require("./models/Task");

// CONNECT TO DATABASE
const db = require("./db");

// init server
const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "public"),
      },
    },
  });

  try {
    // Register plugins
    await server.register(Inert);
    await server.register(Vision);
  } catch (error) {
    throw error;
  }

  // Templates
  server.views({
    engines: {
      html: require("handlebars"),
    },
    path: __dirname + "/views",
  });

  // Static routes
  server.route({
    method: "GET",
    path: "/picture.png",
    handler: function (request, reply) {
      return reply.file("./picture.png");
    },
  });

  server.route({
    method: "GET",
    path: "/about",
    handler: (request, reply) => {
      return reply.file("./about.html");
    },
  });

  // Dynamic routes
  server.route({
    method: "GET",
    path: "/",
    handler: (request, reply) => {
      //   reply("<h1>Hello World!</h1>");
      return reply.view("index", {
        name: "Baptiste MUDAY",
      });
    },
  });

  server.route({
    method: "GET",
    path: "/user/{name}",
    handler: (request, reply) => {
      return reply("<h1>Hello, " + request.params.name + "</h1>");
    },
  });

  // GET Tasks route
  server.route({
    method: "GET",
    path: "/tasks",
    handler: async (request, reply) => {
      //   return reply.view("tasks", {
      //     tasks: [
      //       { text: "Task One" },
      //       { text: "Task Two" },
      //       { text: "Task Three" },
      //     ],
      //   });

      try {
        let tasks = await Task.find({}).lean();
        console.log("tasks", tasks);

        return reply.view("tasks", {
          tasks,
        });
      } catch (error) {
        throw error;
      }
    },
  });

  // GET Task Route
  server.route({
    method: "GET",
    path: "/task/:id",
    handler: async (request, reply) => {
      // params
    },
  });

  // POST Tasks Route
  server.route({
    method: "POST",
    path: "/tasks",
    handler: async (request, reply) => {
      let text = request.payload.text;

      try {
        let newTask = await Task.create({ text });
        console.log("new task", newTask);

        return reply.redirect().location("tasks");
      } catch (error) {
        throw error;
      }
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
