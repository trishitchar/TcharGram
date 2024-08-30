import DataURIParser from "datauri/parser";
import path from 'path'
import { Request } from "express";

const parser = new DataURIParser();

interface IFile {
    originalName: string;
    buffer: Buffer;
}

const getDataUri  = (file: IFile): String | undefined =>{
    try {

        if(!file || !file.originalName || !file.buffer){
            throw new Error("Invalid file object");
        }

        // extracting file extension
        const extensionName = path.extname(file.originalName).toString();

        // Convert the file buffer to a Data URI
        const dataUri = parser.format(extensionName,file.buffer).content;

        if(!dataUri){
            throw new Error("Failed to convert file to Data URI");
        }

        return dataUri;
    } catch (error) {
        console.error("Error in getDataUri:", error);
        return undefined; 
    }
}

export default getDataUri;