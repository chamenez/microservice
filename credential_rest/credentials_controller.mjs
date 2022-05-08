import * as credentials from './credentials_model.mjs';
import express, { request } from 'express';
const app = express();

const PORT = 3000;

app.get("/create", (req, res) => {
    credentials.createCredential(req.query.email, req.query.number)
        .then(credential => {
            res.send(credential);
        })
        .catch(Error => {
            console.error(Error);
            res.send({ Error: 'Request failed' });
        });
});

app.get("/retrieve", (req, res, next) => {
    credentials.findCredentials(req.query, '', 0)
        .then(credentials => {
            res.send(credentials);
        })
        .catch(Error => {
            console.error(Error);
            res.send({ Error: 'Request failed' });
        });
    next()
});

let zeroParameters = 0
app.use("/retrieve", (req, res) => {
    if (Object.keys(req.query).length === 0) {
        zeroParameters += 1
    }
});

app.get("/update", (req, res) => {
    credentials.replaceCredential(req.query._id, req.query.email, req.query.number)
        .then(modifiedCount => {
            res.send({ modifiedCount:  modifiedCount });
        })
        .catch(error => {                           
            res.send({ Error: "Not found" });
        });
});

app.get("/delete", (req, res) => {
    credentials.deleteByMany(req.query._id, req.query.email, req.query.number)
        .then(deletedCount => {
            res.send({ deletedCount: deletedCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});