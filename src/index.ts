import express, {Request, Response} from "express"
import bodyParser from 'body-parser'


const app = express()

const port = process.env.PORT || 5000

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)
enum Resolutions {P144="P144", P240="P240", P360="P360", P480="P480", P720="P720", P1080="P1080", P1440="P1440", P2160="P2160"}
let videos = [{
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
}]



app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.post('/videos', (req: Request, res: Response) => {
    const apiErrorResult: Object[] = [];
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;

    if (!title || typeof title !== 'string' ||  !title.trim() || title.length > 40) {
        apiErrorResult.push({
            "message": "string",
            "field": "title"
        })
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        apiErrorResult.push({
            "message": "string",
            "field": "author"
        })
    }
    if(availableResolutions && !availableResolutions.every((r: string) => Object.keys(Resolutions).includes(r))){
        apiErrorResult.push({
            "message": "string",
            "field": "availableResolutions"
        })
    }
    if (apiErrorResult.length != 0) {
        res.status(400).send({errorMessage: apiErrorResult})
    } else {
        const createdAt = new Date();
        let publicationDate = new Date();
        publicationDate.setDate(publicationDate.getDate() +1)
        const newVideo = {
            id: +(new Date()),
            title,
            author,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
            availableResolutions: availableResolutions,
        }
        videos.push(newVideo)
        res.status(201).send(newVideo)
    }
})

app.get('/videos/:id', (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if (video) {
        res.status(200).send(video)
    } else {
        res.sendStatus(404)
    }
})

app.put('/videos/:id', (req: Request, res: Response) => {
    const apiErrorResult: Object[] = [];
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;

    if (!title || typeof title !== 'string' ||  !title.trim() || title.length > 40) {
        apiErrorResult.push({
            "message": "string",
            "field": "title"
        })
    }
    if (!author || typeof author !== 'string' ||  !author.trim() || author.length > 20) {
        apiErrorResult.push({
            "message": "string",
            "field": "author"
        })
    }
    if(availableResolutions && !availableResolutions.every((r: string) => Object.keys(Resolutions).includes(r))){
        apiErrorResult.push({
            "message": "string",
            "field": "availableResolutions"
        })
    }
    if (typeof canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
        apiErrorResult.push({
            "message": "string",
            "field": "canBeDownloaded"
        })
    }
    if (typeof minAgeRestriction || minAgeRestriction.length > 18 || minAgeRestriction.length < 1) {
        apiErrorResult.push({
            "message": "string",
            "field": "minAgeRestriction"
        })
    }
    if (!publicationDate || typeof publicationDate !== 'string' ||  !publicationDate.trim()) {
        apiErrorResult.push({
            "message": "string",
            "field": "publicationDate"
        })
    }
    if (apiErrorResult.length != 0) {
        res.status(400).send({errorMessage: apiErrorResult})
    } else {
        let video = videos.find(p => p.id === +req.params.id)
        if (video) {
            video.title = title;
            video.author = author;
            video.availableResolutions = availableResolutions;
            video.minAgeRestriction = minAgeRestriction;
            video.publicationDate = publicationDate;
            res.status(204).send(video)
        } else{
            res.sendStatus(404)
        }
}})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i=0; i<videos.length; i++){
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.sendStatus(204)
            return;
        }
    }
    res.sendStatus(404)
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.length = 0
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})