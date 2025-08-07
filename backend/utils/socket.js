const ServiceProvider = require("../models/ServiceProvider");

let io;
const onlineProviders = new Map();
const onlineHomeowners = new Map();

const setupSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*", // TODO: frontend url in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("registerProvider", async (providerId) => {
      const provider = await ServiceProvider.findOne({ user: providerId });
      if (!provider) return;

      const key = provider._id.toString(); 
      onlineProviders.set(key, socket.id);

      console.log("✅ Provider online:", key);
    });

    socket.on("registerHomeowner" , async (homeownerId) => {
      
      onlineHomeowners.set(homeownerId, socket.id);
      console.log("✅ Homeowner online", homeownerId);
    });


    socket.on("disconnect", () => {
      for (const [id, sockId] of onlineProviders.entries()) {
        if (sockId === socket.id) {
          onlineProviders.delete(id);
          break;
        }
      }
           for (const [id, sockId] of onlineHomeowners.entries()) {
        if (sockId === socket.id) {
          onlineHomeowners.delete(id);
          break;
        }
      }
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

const getIO = () => io;
const getOnlineProviders = () => onlineProviders;
const getOnlineHomeowners = () => onlineHomeowners;

module.exports = {
  setupSocket,
  getIO,
  getOnlineProviders,
  getOnlineHomeowners
};
