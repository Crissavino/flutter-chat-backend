const {generateJWT} = require("../../../../../helpers/jwt");
const bcrypt = require("bcryptjs");
const User = require('../../../../../models/User');

const OneUserCanRegisterCommandHandler = class OneUserCanRegisterCommandHandler {

    constructor(
        userRepository,
        playerRepository,
        deviceRepository
    ) {
        this.userRepository = userRepository;
        this.playerRepository = playerRepository;
        this.deviceRepository = deviceRepository;
    }

    async handler(command) {
        const email = command.getEmail();
        // const existEmail = await this.userRepository.findOneBy(email);
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return {
                'success': false,
                'message': 'Las credenciales no son validas',
            };
        }

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(command.getPassword(), salt);

        const user = await this.userRepository.create(
            command.getFullName(),
            command.getEmail(),
            password,
            command.getType(),
            command.getLanguage()
        );

        const token = await generateJWT(user.id);

        const { player, userWithPlayer } = await this.playerRepository.create(user);

        const { device, userUpdated, _ } = await this.deviceRepository.create(userWithPlayer, player, command.getDeviceId(), command.getType(), command.getLanguage(), token);

        // const { _, userWithDevice } = await this.playerRepository.create(userUpdated, device);

        return {
            'success': true,
            'message': 'User stored',
            'user': userUpdated,
            'token': token
        };

    }
}

module.exports = {
    OneUserCanRegisterCommandHandler,
}