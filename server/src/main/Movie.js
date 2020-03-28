const DataBase = require("./DBManager");


class Movie extends Product {

    constructor(id, name, categoryId) {
        super(id, name, categoryId);
        this.movieKey = null;
        this.examinationRoom = null;
        this.isMovieRemoved = null;
        DataBase.add('movie', { id: id, name: name, categoryId: categoryId });
        DataBase.setDestroyTimer('movies',false,'2 YEAR','1 DAY','isMovieRemoved');
    }
    
    equals(toCompare) {
        return (
            super(toCompare) &&
            toCompare.movieKey === this.movieKey &&
            toCompare.examinationRoom === this.examinationRoom &&
            toCompare.isMovieRemoved === this.isMovieRemoved 
        );
    }
}
module.exports = Movie;