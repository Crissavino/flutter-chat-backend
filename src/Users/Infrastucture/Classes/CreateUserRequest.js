const faker = require('faker');

module.exports = class CreateUserRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const fullName = this.request.body.fullName
        if (fullName == null || fullName === '') {
            success = false;
        }

        const email = this.request.body.email;
        if (email == null || email === '') {
            success = false;
        }

        const password = this.request.body.password;
        if (password == null || password === '') {
            success = false;
        }

        const type = this.request.body.type;
        if (type == null || type === '') {
            success = false;
        }

        const language = this.request.body.language;
        if (language == null || language === '') {
            success = false;
        }

        const deviceId = this.request.body.deviceId;
        if (deviceId == null || deviceId === '') {
            success = false;
        }

        return {
            success: success,
            fullName: fullName,
            email: email,
            password: password,
            type: type,
            language: language,
            deviceId: deviceId,
        }
    }

}

