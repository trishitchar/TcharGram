// src/utils/dataUri.util.ts

// import path from 'path';

/**
 * Converts a file buffer to a Data URI
 * @param file - The file object received from multer
 * @returns A Data URI string representing the file
 */
const getDataUri = (file: Express.Multer.File): string => {
  if (!file) {
    throw new Error("File is not provided.");
  }

  // Extract the file's MIME type
  const mimeType = file.mimetype;

  // Ensure the buffer contains data
  if (!file.buffer || !file.buffer.length) {
    throw new Error("File buffer is empty or not available.");
  }

  // Convert the file buffer to a base64 string
  const base64Data = file.buffer.toString('base64');

  // Combine the MIME type and base64 data to form the Data URI
  return `data:${mimeType};base64,${base64Data}`;
};

export default getDataUri;
