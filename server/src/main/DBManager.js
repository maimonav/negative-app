const Sequelize = require('sequelize');
const { userSchema, employeeSchema } = require("./Models");

class DataBase {




    static initDB(dbName) {
        this.sequelize = new Sequelize(dbName, 'root', 'admin', {
            host: 'localhost',
            dialect: 'mysql'
        });

        this.User = this.sequelize.define('user', userSchema(), {});
        this.Employee = this.sequelize.define('employee', employeeSchema(this.User), {});
        this.models = { user: this.User, employee: this.Employee };

        return this.sequelize;
    }

    static init() {
        this.initDB('mydb');
    }

    async close() {
        await this.sequelize.close();
    }

    static add(modelName, element) {
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    return model.create(element, { transaction: t });
                })
                    .catch((error => console.log(error)));

            } catch (error) {
                console.log(error);
            }
        });
    }

    static getById(modelName, id) {
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    let res = model.findByPk(id, { transaction: t });
                    return res;
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }

    static update(modelName, id , element) {
        const model = this.models[modelName];
        return model.sync().then(() => {
            try {
                return this.sequelize.transaction((t) => {
                    return model.update(element, { where: { id: id } ,transaction: t });
                })
                    .catch((error => console.log(error)));
            } catch (error) {
                console.log(error);
            }
        });
    }


};

module.exports = DataBase;
