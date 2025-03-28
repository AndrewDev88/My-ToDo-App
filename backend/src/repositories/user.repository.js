import User from '../models/user.model.js';

class UserRepository {
    async createUser(userData) {
        return await User.create(userData)
    }

    async getUserByEmail(email) {
        const user = await User.findOne({where:{ email }});
        return user?.get({ plain: true });
    }
}

export default new UserRepository();