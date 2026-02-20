import bcrypt from "bcryptjs";
import User from "../models/User.js";

/* ------------------------------------------------------
   👤 Création d’un employé (Admin)
------------------------------------------------------- */
export const createEmployee = async (req, res) => {
  try {
    const { email, username, password, firstname, lastname, phone } = req.body;

    if (!email || !username || !password || !firstname || !lastname || !phone) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await User.create({
      email,
      username,
      password: hashedPassword,
      firstname,
      lastname,
      phone,
      role: "employee",
      isSuspended: false,
    });

    res.status(201).json({
      message: "Employé créé avec succès",
      employee: {
        id: employee._id,
        email: employee.email,
        username: employee.username,
        firstname: employee.firstname,
        lastname: employee.lastname,
        phone: employee.phone,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error("Erreur création employé :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* ------------------------------------------------------
   🚫 Suspension d’un utilisateur (Admin)
------------------------------------------------------- */
export const suspendUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isSuspended: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.status(200).json({
      message: "Utilisateur suspendu avec succès",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isSuspended: user.isSuspended,
      },
    });
  } catch (error) {
    console.error("Erreur suspension utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
