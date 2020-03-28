const DataBase = require("./DBManager");


class Order {

    constructor(id, date, creatorEmployeeId , supplierId) {
        super(id, name, categoryId);
        this.id = id;
        this.date = date;
        this.creatorEmployeeId = creatorEmployeeId;
        this.recipientEmployeeId = null;
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
module.exports = Order;