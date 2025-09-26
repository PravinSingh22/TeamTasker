import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { signupSchema, loginSchema } from '../utils/validators.js';
import { ActivityLog } from '../models/ActivityLog.js';

export async function signup(req, res) {
  const { error, value } = signupSchema.validate(req.body);
  console.log("Value", value);
  if (error) return res.status(400).json({ message: error.message });
  const { name, email, password } = value;
  console.log("Name", name);
  console.log("Email", email);
  console.log("Password", password);
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  console.log("PasswordHash", passwordHash);
  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '1d' });
  await ActivityLog.create({ actor: user._id, action: 'user_signup', entityType: 'user', entityId: user._id });
  return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
}

export async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const { email, password } = value;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '1d' });
  await ActivityLog.create({ actor: user._id, action: 'user_login', entityType: 'user', entityId: user._id });
  return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
}

