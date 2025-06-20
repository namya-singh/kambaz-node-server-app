// // import db from "../Database/index.js";
// //
// // import { v4 as uuidv4 } from "uuid";
// //
// // let { users } = db;
// //
// // // Using the simpler version of createUser from your first snippet:
// // export const createUser = (user) => {
// //     users = [...users, { ...user, _id: uuidv4() }];
// //     return users[users.length - 1]; // return the newly created user
// // };
// //
// // // findUserByUsername is identical in both, so keep one:
// // export const findUserByUsername = (username) =>
// //     users.find((user) => user.username === username);
// //
// // // The rest of your user management functions:
// // export const findAllUsers = () => users;
// //
// // export const findUserById = (userId) =>
// //     users.find((user) => user._id === userId);
// //
// // export const findUserByCredentials = (username, password) =>
// //     users.find((user) => user.username === username && user.password === password);
// //
// // export const updateUser = (userId, user) =>
// //     (users = users.map((u) => (u._id === userId ? user : u)));
// //
// // export const deleteUser = (userId) =>
// //     (users = users.filter((u) => u._id !== userId));
//
//
// import model from "./model.js"; // Mongoose User model
//
// // Create a user in the database and return the created user
// export const createUser = async (user) => {
//     const createdUser = await model.create(user);
//     return createdUser;
// };
//
//
// // Find all users
// export const findAllUsers = () => model.find();
//
// // Find user by ID
// export const findUserById = (userId) => model.findById(userId);
//
// // Find user by username
// export const findUserByUsername = (username) => model.findOne({ username });
//
// // Find user by credentials (username & password)
// export const findUserByCredentials = (username, password) =>
//     model.findOne({ username, password });
//
// // Update user by ID, return result of update
// export const updateUser = (userId, user) =>
//     model.updateOne({ _id: userId }, { $set: user });
//
// // Delete user by ID, return result of deletion
// export const deleteUser = (userId) => model.deleteOne({ _id: userId });
// export const findUsersByRole = (role) => model.find({ role: role });
//
// export const findUsersByPartialName = (partialName) => {
//     const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
//     return model.find({
//                           $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
//                       });
// };
//
//
//
// import model from "./model.js"; // Mongoose User model
//
// // export const createUser = async (user) => model.create(user);
// export const createUser = (user) => {
//     const newUser = { ...user, _id: uuidv4() };
//     return model.create(newUser);
// }
//
//
// export const findAllUsers = () => model.find();
//
// export const findUserById = (userId) => model.findById(userId);
//
// export const findUserByUsername = (username) => model.findOne({ username });
//
// export const findUserByCredentials = (username, password) =>
//     model.findOne({ username, password });
//
// export const updateUser = (userId, user) =>
//     model.updateOne({ _id: userId }, { $set: user });
//
// export const deleteUser = (userId) => model.deleteOne({ _id: userId });
//
// export const findUsersByRole = (role) => model.find({ role });
//
// export const findUsersByPartialName = (partialName) => {
//     const regex = new RegExp(partialName, "i");
//     return model.find({
//                           $or: [
//                               { firstName: { $regex: regex } },
//                               { lastName: { $regex: regex } },
//                           ],
//                       });
// };
//
//



import UserModel from "./model.js";
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const createUser = async (user) => {
    const { password, ...rest } = user;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
    const newUser = { ...rest, password: hashedPassword, _id: uuidv4() };
    return model.create(newUser);
};

//
// export const createUser = (user) => {
//     const { _id, ...u } = user;
//     const newUser       = { ...u, _id: uuidv4() };
//     return model.create(newUser);
// };

export const findUserById = async (userId) => {
    return UserModel.findById(userId).exec();
};


export const findUserByUsername = async (username) => {
    return UserModel.findOne({ username }).exec();
};

export const findUserByCredentials = async (username, password) => {
    const user = await UserModel.findOne({
                                             $or: [
                                                 { username },
                                                 { loginId: username }
                                             ]
                                         }).exec();

    if (!user) return null;

    try {
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (passwordMatches) return user;
    } catch (e) {
        console.warn("bcrypt.compare failed:", e.message);
    }

    return null;
};


export const updateUser = async (userId, updates) => {
    return UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    ).exec();
};


export const deleteUser = async (userId) => {
    return UserModel.findByIdAndDelete(userId).exec();
};
export const findUsersByRole = (role) =>
    UserModel.find({ role }).exec();

export const findUsersByPartialName = (partialName) => {
    const nameStr = Array.isArray(partialName)
                    ? partialName[0]
                    : String(partialName);

    const regex = new RegExp(nameStr, "i");

    return model
        .find({
                  $or: [
                      { firstName: { $regex: regex } },
                      { lastName:  { $regex: regex } },
                  ],
              })
        .exec();
};

export const findAllUsers = () =>
    UserModel.find().exec();