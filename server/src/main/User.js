const DataBase = require("./DBManager");


class User {
    constructor(id, userName, password, permissions) {
        this.sha256 = require("js-sha256").sha256;
        this.id = id;
        this.userName = userName;
        this.password = this.sha256(userName + password);
        this.permissions = permissions;
        this.Loggedin = false;
        DataBase.add('user',{ id:id,username:userName, password:password, permissions:permissions});

    }

    login(userName, password) {
        console.log(userName, this.sha256(userName + password));
        console.log(this.userName, this.password);

        if (this.Loggedin) {
            return "The user already connected";
        }
        if (
            this.userName !== userName ||
            this.password !== this.sha256(userName + password)
        ) {
            return "Incorrect user name or password";
        }
        this.Loggedin = true;
        console.log(this);
        return "User Logged in succesfully.";
    }

    logout() {
        if (!this.Loggedin) return "The user isn't connected";
        this.Loggedin = false;
        return "Logout succeded.";
    }

    isLoggedin() {
        return this.Loggedin;
    }

    permmisionCheck(permissionRequired) {
        return this.permissions.includes(permissionRequired);
    }

    equals(toCompare) {
        return (
            toCompare.userName === this.userName &&
            toCompare.password === this.password &&
            toCompare.permissions === this.permissions
        );
    }
}

module.exports = User;