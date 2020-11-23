module.exports = class CreateChatRoomRequest {
    constructor(request) {
        this.request = request;
    }

    trigger() {

        let success = true;

        const currentUser = this.request.body.currentUser;
        if (currentUser == null) {
            success = false;
        }

        const groupName = this.request.body.groupName;
        if (groupName == null || groupName === '') {
            success = false;
        }

        const usersToAddToGroup = this.request.body.usersToAddToGroup;
        if (usersToAddToGroup == null || usersToAddToGroup.length === 0) {
            success = false;
        }

        return {
            success: success,
            currentUser: currentUser,
            groupName: groupName,
            usersToAddToGroup: usersToAddToGroup,
        }
    }

}

