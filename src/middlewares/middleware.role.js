const { ADMIN, BOSS, USER } = require('../common/roles');

module.exports = {
    checkUserRoles: (arrRole = []) => (req, res, next) => {
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
    },

    checkBodyProps: (req, res, next) => {
        try {
            const { _id, roles } = req.userLogged;
            const { boss, subordinates } = req.body;

            if (['POST', 'PATCH'].includes(req.method) && subordinates) {
                return res.status(403).send({ error: 'Forbidden prop: \"subordinates\"'});
            }

            if (req.method === 'PATCH') {
                const { user_id } = req.params

                if (roles === USER) {
                    if (String(_id) !== user_id) {
                        return res.status(403).send({ error: `Forbidden to change other user with role: ${roles}`});
                    }

                    if (boss || req.body.roles) {
                        return res.status(403).send({ error: `Forbidden body prop: "boss" or "roles" for role: ${roles}`});
                    }
                }

                if (roles === BOSS) {
                    if (String(_id) === user_id && (boss || req.body.roles)) {
                        return res.status(403).send({ error: 'Forbidden props: \"roles\", \"boss\"'});
                    }
/*
                    if (String(_id) !== user_id && (req.body.roles)) {
                        return res.status(403).send({ error: 'Forbidden props: \"roles\"'});
                    }
                    */
                } 
            }

            next();
        } catch (err) {
            next(err);
        }
    }
};
