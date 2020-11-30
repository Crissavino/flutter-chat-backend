module.exports = class OneUserCanCreateAChatRoomCommand {

    constructor(currentUser, currentDevice, usersToAddToGroup, groupName) {
        this.currentUser = currentUser
        this.currentDevice = currentDevice
        this.usersToAddToGroup = usersToAddToGroup
        this.groupName = groupName
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getCurrentDevice() {
        return this.currentDevice;
    }

    getUsersToAddToGroup() {
        return this.usersToAddToGroup;
    }

    getGroupName() {
        return this.groupName;
    }

}