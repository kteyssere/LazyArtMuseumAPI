const express = require('express');
const exhibitionsController = require('../controllers/exhibition.controller')

const exhibitionRouter = express.Router();
exhibitionRouter.get('/', exhibitionsController.getExhibitions);
exhibitionRouter.get('/:id', exhibitionsController.getExhibition);
exhibitionRouter.get('/artist/:artist', exhibitionsController.getExhibitionsByArtist);
exhibitionRouter.get('/date/:date', exhibitionsController.getExhibitionsByDate);
exhibitionRouter.post('/', exhibitionsController.postExhibition);
exhibitionRouter.put('/', exhibitionsController.putExhibition);
exhibitionRouter.delete('/:id', exhibitionsController.deleteExhibition);

module.exports = exhibitionRouter;