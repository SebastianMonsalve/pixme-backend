import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import Dump from "../models/Dump.js";
import Image from "../models/Image.js";
import User from "../models/User.js";

export const getDumps = async (req, res) => {
  try {
    const { author } = req.query;
    const dumps = await Dump.find({ author: author });
    return res.send(dumps);
  } catch (error) {
    console.log(error);
  }
};

export const deleteDumps = async (req, res) => {
  try {
    const dumpsDeleted = await Dump.findByIdAndDelete(req.params.id);
    if (!dumpsDeleted) return res.sendStatus(404);
    if (dumpsDeleted.image.public_id) {
      await deleteImage(dumpsDeleted.image.public_id);
    }
    return res.send(dumpsDeleted);
  } catch (error) {
    console.log(error);
  }
};

export const recoveryDumps = async (req, res) => {
  try {
    const dumpsRecovery = await Dump.findByIdAndDelete(req.params.id);
    const newImageRecovery = new Image({
      name: dumpsRecovery.name,
      image: dumpsRecovery.image,
      isFavorite: dumpsRecovery.isFavorite,
      author: dumpsRecovery.author,
    });

    const newImage = await newImageRecovery.save();

    const userSection = await User.findOne({ _id: newImage.author });
    userSection.images = userSection.images.concat(newImage._id);
    await userSection.save();
    return res.send(dumpsRecovery);
  } catch (error) {
    console.log(error);
  }
};
