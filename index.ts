import { Writable, Readable } from "stream";
import express from "express";
import { Request, Response, Application } from "express";
import { Storage, Bucket, File } from "@google-cloud/storage";

const BUCKET_NAME = process.env.BUCKET_NAME || "";

const server: Application = express();

server.post("/upload", (request: Request, response:  Response) => {
    const filename: string = Date.now().toString();
    const bucket: Bucket = new Storage().bucket(BUCKET_NAME);
    const file: File = bucket.file(filename);
    const stream: Writable = file.createWriteStream({
        metadata: {
            contentType: request.headers["content-type"]
        }
    });

    request
        .pipe(stream)
        .on("finish", () => response.status(201).send({ filename }))
        .on("error", (error: Error) => response.status(500).send({ message: error.message }));
});

server.get("/download/:filename", async (request: Request, response: Response) => {
    const filename: string = request.params.filename;
    const bucket: Bucket = new Storage().bucket(BUCKET_NAME);
    const file: File = bucket.file(filename);
    const metadata = (await file.getMetadata())[0];
    const stream: Readable = file.createReadStream(metadata.name);
    response.writeHead(200, { 
        "Content-Type": metadata.contentType,
        "Content-Length": metadata.size
    })
    stream.pipe(response);
});

server.listen(3000, () => console.log("Server running at 3000"));