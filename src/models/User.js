export class User {
  constructor(id, name, email, age) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
  }

  static validate(data) {
    const { name, email, age } = data;

    if (!name || typeof name !== "string" || name.trim().length < 3) {
      return "O nome deve ter pelo menos 3 caracteres.";
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return "Informe um e-mail válido.";
    }

    if (age === undefined || age === null || Number.isNaN(Number(age))) {
      return "Informe uma idade válida.";
    }

    if (Number(age) < 0) {
      return "A idade não pode ser negativa.";
    }

    return null;
  }
}