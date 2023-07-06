"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const parserMiddleware = (0, body_parser_1.default)({});
app.use(parserMiddleware);
var Resolutions;
(function (Resolutions) {
    Resolutions["P144"] = "P144";
    Resolutions["P240"] = "P240";
    Resolutions["P360"] = "P360";
    Resolutions["P480"] = "P480";
    Resolutions["P720"] = "P720";
    Resolutions["P1080"] = "P1080";
    Resolutions["P1440"] = "P1440";
    Resolutions["P2160"] = "P2160";
})(Resolutions || (Resolutions = {}));
const videos = [{
        id: 1,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-07-05T18:20:30.739Z",
        publicationDate: "2023-07-05T18:20:30.739Z",
        availableResolutions: ['P144']
    }, {
        id: 2,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-07-05T18:20:30.739Z",
        publicationDate: "2023-07-05T18:20:30.739Z",
        availableResolutions: ['P144']
    }];
app.get('/videos', (req, res) => {
    res.send(videos);
});
app.post('/videos', (req, res) => {
    const apiErrorResult = [];
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        apiErrorResult.push({
            "message": "string",
            "field": "title"
        });
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        apiErrorResult.push({
            "message": "string",
            "field": "author"
        });
    }
    if (availableResolutions && !availableResolutions.every(r => Object.keys(Resolutions).includes(r))) {
        apiErrorResult.push({
            "message": "string",
            "field": "availableResolutions"
        });
    }
    if (apiErrorResult.length != 0) {
        res.status(400).send({ errorMessage: apiErrorResult });
    }
    else {
        const createdAt = new Date();
        let publicationDate = new Date();
        publicationDate.setDate(publicationDate.getDate() + 1);
        const newVideo = {
            id: +(new Date()),
            title,
            author,
            availableResolutions,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
        };
        videos.push(newVideo);
        res.sendStatus(201).send(newVideo);
    }
});
app.get('/videos/:id', (req, res) => {
    let video = videos.find(p => p.id === +req.params.id);
    if (video) {
        res.sendStatus(200).send(video);
    }
    else {
        res.sendStatus(404);
    }
});
app.put('/videos/:id', (req, res) => {
    const apiErrorResult = [];
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        apiErrorResult.push({
            "message": "string",
            "field": "title"
        });
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        apiErrorResult.push({
            "message": "string",
            "field": "author"
        });
    }
    if (availableResolutions && !availableResolutions.every(r => Object.keys(Resolutions).includes(r)) || typeof availableResolutions !== 'string') {
        apiErrorResult.push({
            "message": "string",
            "field": "availableResolutions"
        });
    }
    if (typeof canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
        apiErrorResult.push({
            "message": "string",
            "field": "canBeDownloaded"
        });
    }
    if (typeof minAgeRestriction || minAgeRestriction.length > 18 || minAgeRestriction.length < 1) {
        apiErrorResult.push({
            "message": "string",
            "field": "minAgeRestriction"
        });
    }
    if (!publicationDate || typeof publicationDate !== 'string' || !publicationDate.trim()) {
        apiErrorResult.push({
            "message": "string",
            "field": "publicationDate"
        });
    }
    if (apiErrorResult.length != 0) {
        res.status(400).send({ errorMessage: apiErrorResult });
    }
    else {
        let video = videos.find(p => p.id === +req.params.id);
        if (video) {
            video.title = title;
            video.author = author;
            video.availableResolutions = availableResolutions;
            video.minAgeRestriction = minAgeRestriction;
            video.publicationDate = publicationDate;
            res.sendStatus(204).send(video);
        }
        else {
            res.sendStatus(404);
        }
    }
});
app.delete('/videos/:id', (req, res) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.sendStatus(204);
            return;
        }
    }
    res.sendStatus(404);
});
app.delete('/testing/all-data', (req, res) => {
    videos.length = 0;
    res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
});
