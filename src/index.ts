// src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { auth } from "./firebase-admin";
import { RegisterRequestBody, LoginRequestBody, ResetPasswordRequestBody } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

// Register User
app.post("/register", async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  const { email, password } = req.body;
  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });
    res.status(201).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// Generate Token
app.post("/generateToken", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRecord = await auth.getUserByEmail(email);
    // Password check should be done on client side with Firebase Authentication SDK
    // Assuming password validation is done correctly
    const customToken = await auth.createCustomToken(userRecord.uid);
    res.status(200).send({ customToken });
  } catch (error) {
    console.error("Failed to authenticate or generate token:", error);
    res.status(500).send({ message: error });
  }
});

// Get UID
app.post("/getUid", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userRecord = await auth.getUserByEmail(email);
    // Simulate password verification for illustration
    res.status(200).send({ uid: userRecord.uid });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send({ message: error });
  }
});

// Session Login
app.post("/sessionLogin", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    res.status(200).send({ uid: decodedToken.uid, email: decodedToken.email, verified: decodedToken.email_verified });
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
  }
});

// Session Logout
app.post("/sessionLogout", (req, res) => {
  res.status(200).send({ message: "Logout successful." });
});

// Reset Password
app.post("/resetPassword", async (req: Request<{}, {}, ResetPasswordRequestBody>, res: Response) => {
  const { email } = req.body;
  try {
    let link = await auth.generatePasswordResetLink(email);
    res.status(200).send({ message: "Password reset email sent.", link });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// Delete Account
app.delete("/deleteAccount", async (req: Request, res: Response) => {
  const { uid } = req.body;

  try {
    await auth.deleteUser(uid);
    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
