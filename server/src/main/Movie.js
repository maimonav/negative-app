const DataBase = require("./DBManager");
const Product = require("./Product");

class Movie extends Product {

    constructor(id, name, categoryId) {
        super(id, name, categoryId);
        this.movieKey = null;
        this.examinationRoom = null;
        this.isMovieRemoved = null;
        DataBase.add('movie', { id: id, name: name, categoryId: categoryId });
        DataBase.setDestroyTimer('movies', false, '2 YEAR', '1 DAY', 'isMovieRemoved');
    }

    editMovie = (categoryId, key, examinationRoom) => {
        super.categoryId = categoryId;
        this.movieKey = key;
        this.examinationRoom = examinationRoom;
        DataBase.update('movie', { id: this.id }, { categoryId: this.categoryId, movieKey:key,examinationRoom:examinationRoom });
        return "The movie edited successfully";
    }

    removeMovie = () => {
        if (this.isMovieRemoved == null) {
            this.isMovieRemoved = new Date();
            DataBase.update('movie', { id: this.id }, { isMovieRemoved: this.isMovieRemoved });
            return "The movie removed successfully";
        }
        else
            return "The movie already removed";
    }

    equals(toCompare) {
        return (
            super.equals(toCompare) &&
            toCompare.movieKey === this.movieKey &&
            toCompare.examinationRoom === this.examinationRoom &&
            toCompare.isMovieRemoved === this.isMovieRemoved
        );
    }
}
module.exports = Movie;