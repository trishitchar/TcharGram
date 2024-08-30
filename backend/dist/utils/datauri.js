import DataURIParser from "datauri/parser";
import path from 'path';
const parser = new DataURIParser();
const getDataUri = (file) => {
    try {
        if (!file || !file.originalName || !file.buffer) {
            throw new Error("Invalid file object");
        }
        // extracting file extension
        const extensionName = path.extname(file.originalName).toString();
        // Convert the file buffer to a Data URI
        const dataUri = parser.format(extensionName, file.buffer).content;
        if (!dataUri) {
            throw new Error("Failed to convert file to Data URI");
        }
        return dataUri;
    }
    catch (error) {
        console.error("Error in getDataUri:", error);
        return undefined;
    }
};
export default getDataUri;
