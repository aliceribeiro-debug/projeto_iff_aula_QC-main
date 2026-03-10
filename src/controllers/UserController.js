import { User } from "../models/User.js";
import { UserRepository } from "../repositories/UserRepository.js";

const repository = new UserRepository();

export class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await repository.findAll();

      return res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Erro interno ao listar usuários."
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await repository.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado."
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Erro interno ao buscar usuário."
      });
    }
  }

  async createUser(req, res) {
    try {
      const error = User.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error
        });
      }

      const existingUser = await repository.findByEmail(req.body.email);

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Já existe um usuário com este e-mail."
        });
      }

      const newUser = await repository.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Usuário cadastrado com sucesso.",
        data: newUser
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Erro interno ao cadastrar usuário."
      });
    }
  }

  async updateUser(req, res) {
    try {
      const error = User.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error
        });
      }

      const existingUser = await repository.findByEmail(req.body.email);

      if (existingUser && existingUser.id !== Number(req.params.id)) {
        return res.status(409).json({
          success: false,
          message: "Já existe outro usuário com este e-mail."
        });
      }

      const updatedUser = await repository.update(req.params.id, req.body);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuário atualizado com sucesso.",
        data: updatedUser
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Erro interno ao atualizar usuário."
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const removed = await repository.delete(req.params.id);

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuário removido com sucesso."
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: "Erro interno ao remover usuário."
      });
    }
  }
}