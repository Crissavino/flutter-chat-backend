const OneUserCanRegisterCommand = class OneUserCanRegisterCommand {
    constructor(fullName, email, password, type, language, deviceId) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.type = type;
        this.language = language;
        this.deviceId = deviceId;
    }

    getFullName() {
        return this.fullName;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    getType() {
        return this.type;
    }

    getLanguage() {
        return this.language;
    }

    getDeviceId() {
        return this.deviceId;
    }

}

module.exports = {
    OneUserCanRegisterCommand,
};