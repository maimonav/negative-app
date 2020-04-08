const DataBase = require("./DBManager");
const logger = require('simple-node-logger').createSimpleLogger('project.log');
const permissionDictionery = { 'ADMIN': 5, 'MANAGER': 4, 'DEPUTY_MANAGER': 3, 'SHIFT_MANAGER': 2, 'EMPLOYEE': 1 }


class User {
    constructor(id, userName, password, permissions) {
        this.sha256 = require("js-sha256").sha256;
        this.id = id;
        this.userName = userName;
        this.password = this.sha256(userName + password);
        this.permissions = permissions;
        this.Loggedin = false;
        this.isUserRemoved = null;
        DataBase.add('user', { id: id, username: userName, password: password, permissions: permissions });
        DataBase.setDestroyTimer('users', false, '2 YEAR', '1 DAY', 'isUserRemoved');
    }



    removeUser = () => {
        if (this.isUserRemoved == null) {
            this.isUserRemoved = new Date();
            DataBase.update('user', { id: this.id }, { isUserRemoved: this.isUserRemoved });
            return true;
        } else
            return false;
    }

    editUser = (password, permissions) => {
        if (password != undefined && password != '')
            this.password = password;
        if (permissions != undefined && User.getPermissionTypeList()[permissions] >= 0)
            this.permissions = permissions;
        DataBase.update('user', { id: this.id }, { password: this.password, permissions: this.permissions });

    }

    login(userName, password) {
        if (this.Loggedin) {
            logger.info('User - login - The ' + userName + ' already connected')
            return "The user already connected";
        }
        if (
            this.userName !== userName || this.password !== this.sha256(userName + password)
        ) {
            logger.info('User - login - Incorrect user name(' + userName + ') or password (' + password + ') ');
            return "Incorrect user name or password";
        }
        this.Loggedin = true;
        return "User Logged in succesfully.";
    }

    logout() {
        if (!this.Loggedin) {
            logger.info('User - logout - The user ' + this.userName + ' tried to disconnect but was not connected in the first place.');
            return "The user isn't connected";
        }
        this.Loggedin = false;
        return "Logout succeded.";
    }

    isLoggedin() {
        return this.Loggedin;
    }

    permissionCheck(permissionRequired) {
        return permissionDictionery[this.permissions] >= permissionDictionery[permissionRequired];
    }

    equals(toCompare) {
        return (
            toCompare.userName === this.userName &&
            toCompare.password === this.password &&
            toCompare.permissions === this.permissions
        );
    }

    static getPermissionTypeList() {
        return permissionDictionery;
    }
}

module.exports = User;