module.exports = class OneUserCanCreateAChatRoomCommand {

    constructor(currentUser, usersToAddToGroup, groupName) {
        this.currentUser = currentUser
        this.usersToAddToGroup = usersToAddToGroup
        this.groupName = groupName
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUsersToAddToGroup() {
        return this.usersToAddToGroup;
    }

    getGroupName() {
        return this.groupName;
    }

}