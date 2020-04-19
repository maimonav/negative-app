const DBlogger = require("simple-node-logger").createSimpleLogger({
    logFilePath: "database.log",
    timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
const uniqid = require("uniqid");

class DataBase {
    static sequelize;
    static connection;
    static models;
    static isTestMode = false;

    static testModeOn() {
        this.isTestMode = true;
    }
    static testModeOff() {
        this.isTestMode = false;
    }

    static connectionMsg = "Database Error: Unable to connect to the database.";

    static errorHandler(error, errId) {
        let handler = error ? this.errorsHandling[error.name] : undefined;
        let msg = handler ?
            handler(error) :
            "Database Error: Cannot complete action.";
        return msg + "\nError ID: " + errId;
    }

    //TODO:: add log
    static errorsHandling = {
        //errors/validation
        SequelizeUniqueConstraintError: (error) =>
            "Database Error: Unique constraint is violated in the database.", //validation, dupplicate primary key - programmers

        //errors/database
        SequelizeForeignKeyConstraintError: (error) =>
            "Database Error: Foreign key constraint is violated in the database.", //link to foreign key while does not exist

        //errors/connection
        SequelizeConnectionError: (error) => this.connectionMsg,
        SequelizeConnectionRefusedError: (error) =>
            this.connectionMsg + " MySql server has stopped running.", //mysql server stopped
        SequelizeAccessDeniedError: (error) =>
            this.connectionMsg +
            " Refused due to insufficient privileges" +
            " - Password to database should be checked.", // wrong password
    };

    static async initGeneralReport() {
        const DBInitial = require("./DBInitializtion");
        return DBInitial.initGeneralReport();
    }

    static async initDB(dbName, password) {
        const DBInitial = require("./DBInitializtion");
        return DBInitial.initDB(dbName, password);
    }

    static async connectAndCreate(dbName, password) {
        const DBInitial = require("./DBInitializtion");
        return DBInitial.connectAndCreate(dbName, password);
    }

    static async close() {
        if (this.isTestMode) return;
        try {
            await this.sequelize.close();
        } catch (error) {
            let errId = uniqid();
            DBlogger.error(errId, " - DBManager - close  - ", error);
            return this.errorHandler(error, errId);
        }
    }

    static async executeActions(actionsList) {
        if (this.isTestMode) return;
        let action;
        let model;
        let name;
        try {
            return this.sequelize
                .transaction(async(t) => {
                    for (let i in actionsList) {
                        action = actionsList[i];
                        model = action.model ? this.models[action.model] : undefined;
                        await action.name(action.params, t, model);
                    }
                })
                .catch((error) => {
                    let errId = uniqid();
                    DBlogger.error(
                        errId,
                        " - DBManager - executeActions  - ",
                        'add',
                        ", ",
                        model,
                        ", ",
                        action.params,
                        " - ",
                        error
                    );
                    return this.errorHandler(error, errId);
                });
        } catch (error) {
            let errId = uniqid();
            DBlogger.error(
                errId,
                " - DBManager - executeActions  - transaction - ",
                error
            );
            return this.errorHandler(error, errId);
        }
    }

    static async add(params, t, model) {
        return model.create(params.element, { transaction: t });
    }

    static async getById(params, t, model) {
        return model.findOne({ where: params.where, transaction: t });
    }

    static async update(params, t, model) {
        return model.update(params.element, {
            where: params.where,
            transaction: t,
        });
    }

    static async remove(params, t, model) {
        return model.destroy({ where: params.where, transaction: t });
    }

    static async findAll(params, t, model) {
        const attributes = params.attributes;
        let attributesArray = [
            [
                this.sequelize.fn(
                    attributes.fn,
                    this.sequelize.col(attributes.fnField)
                ),
                attributes.fnField,
            ],
        ];
        return model.findAll({
            attributes: attributesArray,
            where: params.where,
            transaction: t,
        });
    }

    static async setDestroyTimer(params, t) {
        let destroyQuery = DataBase.getDestroyQuery(
            params.table,
            params.afterCreate,
            params.deleteTime,
            params.eventTime,
            params.prop
        );
        return DataBase.sequelize.query(destroyQuery, { t }).catch((error) => {
            let errId = uniqid();
            DBlogger.error(
                errId,
                " - DBManager - setDestroyTimer - query - ",
                destroyQuery,
                " - ",
                error
            );
            return this.errorHandler(error, errId);
        });
    }

    static async singleAdd(modelName, element) {
        if (this.isTestMode) return;
        const model = this.models[modelName];
        try {
            return this.sequelize
                .transaction((t) => {
                    return model.create(element, { transaction: t });
                })
                .catch((error) => {
                    let errId = uniqid();
                    DBlogger.error(
                        errId,
                        " - DBManager - singleAdd - ",
                        modelName,
                        ", ",
                        element,
                        " - ",
                        error
                    );
                    return this.errorHandler(error, errId);
                });
        } catch (error) {
            let errId = uniqid();
            DBlogger.error(errId, " - DBManager - singleAdd - transaction - ", error);
            return this.errorHandler(error, errId);
        }
    }

    static async singleGetById(modelName, where) {
        if (this.isTestMode) return;
        const model = this.models[modelName];
        try {
            return this.sequelize
                .transaction((t) => {
                    let res = model.findOne({ where: where, transaction: t });
                    return res;
                })
                .catch((error) => {
                    let errId = uniqid();
                    DBlogger.error(
                        errId,
                        " - DBManager - singleGetById - ",
                        modelName,
                        ", ",
                        where,
                        " - ",
                        error
                    );
                    return this.errorHandler(error, errId);
                });
        } catch (error) {
            let errId = uniqid();
            DBlogger.error(
                errId,
                " - DBManager - singleGetById - transaction - ",
                error
            );
            return this.errorHandler(error, errId);
        }
    }

    static async singleUpdate(modelName, where, element) {
        if (this.isTestMode) return;
        const model = this.models[modelName];
        try {
            return this.sequelize
                .transaction((t) => {
                    return model.update(element, { where: where, transaction: t });
                })
                .catch((error) => {
                    let errId = uniqid();
                    DBlogger.error(
                        errId,
                        " - DBManager - singleUpdate - ",
                        modelName,
                        ", ",
                        where,
                        ", ",
                        element,
                        " - ",
                        error
                    );
                    return this.errorHandler(error, errId);
                });
        } catch (error) {
            let errId = uniqid();
            DBlogger.error(
                errId,
                " - DBManager - singleUpdate - transaction - ",
                error
            );
            return this.errorHandler(error, errId);
        }
    }

    static async singleRemove(modelName, where) {
        if (this.isTestMode) return;
        const model = this.models[modelName];
        try {
            return this.sequelize
                .transaction((t) => {
                    return model.destroy({ where: where, transaction: t });
                })
                .catch((error) => {
                    let errId = uniqid();
                    DBlogger.error(
                        errId,
                        " - DBManager - singleRemove - ",
                        modelName,
                        ", ",
                        where,
                        " - ",
                        error
                    );
                    return this.errorHandler(error, errId);
                });
        } catch (error) {
            let errId = uniqid();
            DBlogger.error(
                errId,
                " - DBManager - singleRemove - transaction - ",
                error
            );
            return this.errorHandler(error, errId);
        }
    }

    static async singleFindAll(modelName, where, attributes) {
        if (this.isTestMode) return;

        let attributesArray = [
            [
                this.sequelize.fn(
                    attributes.fn,
                    this.sequelize.col(attributes.fnField)
                ),
                attributes.fnField,
            ],
        ];
        const model = this.models[modelName];
        try {
            return this.sequelize
                .transaction((t) => {
                    return model.findAll({
                        attributes: attributesArray,
                        where: where,
                        transaction: t,
                    });
                })
                .catch((error) => {
                    let errId = uniqid();
                    DBlogger.error(
                        errId,
                        " - DBManager - singleFindAll - ",
                        modelName,
                        ", ",
                        where,
                        ", ",
                        attributes,
                        " - ",
                        error
                    );
                    return this.errorHandler(error, errId);
                });
        } catch (error) {
            let errId = uniqid();
            DBlogger.error(
                errId,
                " - DBManager - singleFindAll - transaction - ",
                error
            );
            return this.errorHandler(error, errId);
        }
    }

    static async singleSetDestroyTimer(
        table,
        afterCreate,
        deleteTime,
        eventTime,
        prop
    ) {
        if (this.isTestMode) return;
        let destroyQuery = DataBase.getDestroyQuery(
            table,
            afterCreate,
            deleteTime,
            eventTime,
            prop
        );
        try {
            return this.sequelize
                .transaction((t) => {
                    return this.sequelize.query(destroyQuery, { t });
                })
                .catch((error) => {
                    let errId = uniqid();
                    DBlogger.error(
                        errId,
                        " - DBManager - singleSetDestroyTimer - ",
                        table,
                        ", ",
                        afterCreate,
                        ", ",
                        deleteTime,
                        ", ",
                        eventTime,
                        ", ",
                        prop,
                        " - ",
                        error
                    );
                    return this.errorHandler(error, errId);
                });
        } catch (error) {
            let errId = uniqid();
            DBlogger.error(
                errId,
                " - DBManager - singleSetDestroyTimer - transaction - ",
                error
            );
            return this.errorHandler(error, errId);
        }
    }

    static getDestroyQuery(table, afterCreate, deleteTime, eventTime, prop) {
        let where = "";
        if (afterCreate) {
            where = "createdAt <= (CURRENT_TIMESTAMP - INTERVAL " + deleteTime + ");";
        } else {
            where =
                prop +
                " IS NOT NULL AND " +
                prop +
                " <= (CURRENT_TIMESTAMP - INTERVAL " +
                deleteTime +
                ");";
        }
        return (
            "CREATE EVENT IF NOT EXISTS delete_event_" +
            table +
            " " +
            "ON SCHEDULE " +
            "EVERY " +
            eventTime +
            " " +
            "DO DELETE FROM " +
            table +
            " WHERE " +
            where
        );
    }
}

module.exports = DataBase;