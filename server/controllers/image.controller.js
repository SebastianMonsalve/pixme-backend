import { uploadImage, deleteImage, uploadVideo } from "../libs/cloudinary.js";
import Image from "../models/Image.js";
import fs from "fs-extra";
import User from "../models/User.js";
import Dump from "../models/Dump.js";

export const createImage = async (req, res) => {
  try {
    const { name, author } = req.body;
    let image = null;
    const format = req.files.image.name.split(".");
    if (req.files.image) {
      if (
        format[format.length - 1] == "mp4" ||
        format[format.length - 1] == "mov"
      ) {
        const result = await uploadVideo(req.files.image.tempFilePath);
        await fs.remove(req.files.image.tempFilePath);
        image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } else {
        const result = await uploadImage(req.files.image.tempFilePath);
        await fs.remove(req.files.image.tempFilePath);
        image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }
    }
    const newImage = new Image({
      name: name,
      image: image,
      isFavorite: false,
      author: author,
    });
    const userSection = await User.findOne({ _id: newImage.author });
    userSection.images = userSection.images.concat(newImage._id);
    await userSection.save();
    const newImageSaved = await newImage.save();
    return res.send(newImageSaved);
  } catch (error) {
    console.log(error);
  }
};

export const deleteImageback = async (req, res) => {
  try {
    const imageDeleted = await Image.findByIdAndDelete(req.params.id);
    if (!imageDeleted) return res.sendStatus(404);
    if (imageDeleted.image.public_id) {
      await deleteImage(imageDeleted.image.public_id);
    }
    const newDump = new Dump({
      name: imageDeleted.name,
      image: imageDeleted.image,
      isFavorite: imageDeleted.isFavorite,
      author: imageDeleted.author,
    });
    await newDump.save();
    return res.send(imageDeleted);
  } catch (error) {
    console.log(error);
  }
};

export const getImages = async (req, res) => {
  try {
    const { author } = req.query;
    const images = await Image.find({ author: author });
    return res.send(images);
  } catch (error) {
    console.log(error);
  }
};

export const updateImage = async (req, res) => {
  try {
    const updatedImages = await Image.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.send(updatedImages);
  } catch (error) {
    console.log(error);
  }
};
