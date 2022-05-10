const Exhibition = require('../model/exhibition.model');

function getExhibitions(req, res) {
    Exhibition.find().sort({ exhibitionId: -1 })
        .then((result) => {
            res.send(result);
        }).catch((err) => {res.status(500).send(err)});
}
function getExhibition(req, res) {
    Exhibition.findOne({exhibitionId: req.params.id})
        .then((result) =>{
            if (result) {
                res.send(result)
            } else {res.status(400).send(`Exhibition id ${req.params.id} does not exist`)}
        })
        .catch((err) => res.status(500).send(err));
}
function getExhibitionsByArtist(req, res) {
    Exhibition.find({artist: req.params.artist})
        .then((result) => {
            if (result) {
                res.send(result)
            } else {res.status(400).send(`Exhibition\'s artist ${req.params.artist} does not exist`)}
        }).catch((err) => {res.status(500).send(err)});
}
function getExhibitionsByDate(req, res) {
    Exhibition.find({date: req.params.date})
        .then((result) => {
            if (result) {
                res.send(result)
            } else {res.status(400).send(`Exhibition\'s date ${req.params.date} does not exist`)}
        }).catch((err) => {res.status(500).send(err)});
}
//PUT : CREATION
function putExhibition(req, res) {
    // if (!req.body.name && !req.body.artist && !req.body.picture && !req.body.date) {
    //     return res.status(400).send('Exhibition\'s name, artist, picture and date are mandatory');
    // }
    const exhibition = new Exhibition({
        name: req.body.name,
        artist: req.body.artist,
        picture: req.body.picture,
        date: req.body.date,
        description: req.body.description,
    });
    exhibition.save()
        .then((result) => {
            res.send(result);
        }).catch((err) => {
        res.status(500).send(err);
    });
}

//POST : UPDATE
function postExhibition(req, res) {
    // if (!req.body.name && !req.body.artist && !req.body.picture && !req.body.date) {
    //     return res.status(400).send('Missing Exhibitions');
    // }
    Exhibition.findOneAndUpdate({exhibitionId: req.params.id}, {
        name: req.body.name,
        artist: req.body.artist,
        picture: req.body.picture,
        date: req.body.date,
        description: req.body.description
    }).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(500).send(err);
    });
}
function deleteExhibition(req, res) {
    Exhibition.findOneAndDelete({exhibitionId: req.params.id})
        .then((result) => {
            res.send(result);
        }).catch((err) => {res.status(500).send(err)});
}

module.exports = {
    getExhibitions, getExhibition, getExhibitionsByArtist, getExhibitionsByDate,
    postExhibition, putExhibition, deleteExhibition
}