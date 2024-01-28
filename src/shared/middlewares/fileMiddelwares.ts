import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";

export const validateExistFile = (req: Request, fieldName: string) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files[fieldName]) {
    throw new Error(`Field <${fieldName}> is required`);
  }

  req.body.fieldName = fieldName;
  return true;
};

export const validateFileExtension = (req: Request, nameField: string, validExtensions: string[]) => {
  const nameImage = req.files[nameField];

  if (!nameImage) {
    throw new Error(`Field <${nameField}> not found`);
  }

  const nameSplited = nameImage.name.split(".");
  const currentExtension = nameSplited[nameSplited.length - 1];

  if (!validExtensions.includes(currentExtension)) {
    throw new Error(`Extension <.${currentExtension}> is not allowed`);
  }

  return true;
};

export const uploadImageInCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  const { fieldName } = req.body;

  if (!req.files || Object.keys(req.files).length === 0 || !req.files[fieldName]) {
    return res.status(500).json({ message: "No files were uploaded or fieldName not found" });
  }

  try {
    const { tempFilePath } = req.files[fieldName];

    const image = await cloudinary.v2.uploader.upload(tempFilePath);

    req.body.cloudUrl = image.secure_url;
    next();
  } catch (error) {
    return res.status(500).json({ message: "We have problems uploading the image, ple try later" });
  }
};

export const replaceImageInCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  const { fieldName, menu } = req.body;

  if (!req.files || Object.keys(req.files).length === 0 || !req.files[fieldName]) {
    return res.status(500).json({ message: "No files were uploaded or fieldName not found" });
  }

  try {
    const { tempFilePath } = req.files[fieldName];
    const imageId = hadleGetImageId(menu.image);

    const image = await cloudinary.v2.uploader.upload(tempFilePath, { public_id: imageId });

    req.body.cloudUrl = image.secure_url;
    next();
  } catch (error) {
    return res.status(500).json({ message: "We have problems uploading the image, ple try later" });
  }
};

export const removeImageFromCloud = async (req: Request, res: Response, next: NextFunction) => {
  const { menu } = req.body;

  const { image } = menu;

  try {
    if (image) {
      const imageId = hadleGetImageId(image);

      cloudinary.v2.uploader.destroy(imageId);

      next();
    }
  } catch (error) {
    return res.status(500).json({ message: "We have problems to delete the image from the cloud, ple try later" });
  }
};

const hadleGetImageId = (imageUrl: string) => {
  if (!imageUrl) return "";

  const splited = imageUrl.split("/");
  const cloudName = splited[splited.length - 1];
  const [imageId] = cloudName.split(".");

  return imageId;
};
