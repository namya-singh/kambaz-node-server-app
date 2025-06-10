import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { users } = db;

// Using the simpler version of createUser from your first snippet:
export const createUser = (user) => {
    users = [...users, { ...user, _id: uuidv4() }];
    return users[users.length - 1]; // return the newly created user
};

// findUserByUsername is identical in both, so keep one:
export const findUserByUsername = (username) =>
    users.find((user) => user.username === username);

// The rest of your user management functions:
export const findAllUsers = () => users;

export const findUserById = (userId) =>
    users.find((user) => user._id === userId);

export const findUserByCredentials = (username, password) =>
    users.find((user) => user.username === username && user.password === password);

export const updateUser = (userId, user) =>
    (users = users.map((u) => (u._id === userId ? user : u)));

export const deleteUser = (userId) =>
    (users = users.filter((u) => u._id !== userId));
