import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { UserController } from "./src/controllers/UserController.js";

const app = express();
const HOST = "0.0.0.0";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userController = new UserController();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/users", (req, res) => userController.getAllUsers(req, res));
app.get("/api/users/:id", (req, res) => userController.getUserById(req, res));
app.post("/api/users", (req, res) => userController.createUser(req, res));
app.put("/api/users/:id", (req, res) => userController.updateUser(req, res));
app.delete("/api/users/:id", (req, res) => userController.deleteUser(req, res));

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});