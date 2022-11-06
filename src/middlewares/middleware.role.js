const { ADMIN, BOSS, USER } = require('../common/roles');

module.exports = {
    checkUserPrivileges: (arrRole = []) => (req, res, next) => {
        try {
            const { roles } = req.userLogged;

            if (!arrRole.length) {
                return next();
            }

            if (!arrRole.includes(roles)) {
                return res.status(403).send({ error: `Forbidden resources for role: ${roles}` });
            }

            next();
        } catch (err) {
            next(err);
        }
    },

    checkRoleAndIdAccess: (roleArr = [ADMIN]) => (req, res, next) => {
        try {
            const { _id, roles } = req.userLogged;
            const id = req.params.user_id;

            if (roleArr.includes(roles)) return next();

            if (String(_id) === id) return next();

            return res.status(403).send({ error: `Forbidden resources for role: ${roles}` });
        } catch (err) {
            next(err);
        }
    }
};
