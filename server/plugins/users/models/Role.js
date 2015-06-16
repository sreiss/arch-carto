module.exports = function(Types) {
    return {
        schema: {
            name: {type: String, required: true, unique: true}
        },
        onModelReady: function(Role) {
            var rolesToUpate = {
                AUTHENTICATED: null,
                MEMBER: null,
                ADMIN: null,
                CARTOGRAPHER: null
            };

            var roleFilter = function(role) {
                if (rolesToUpate[role.name] === null) {
                    return true;
                }
                return false;
            };

            Role.find({}, function(err, roles) {
                if (err) {
                    throw err;
                }

                for (var roleName in rolesToUpate) {
                    rolesToUpate[roleName] = roles.filter(roleFilter)[0] || null;
                }

                for (var roleName in rolesToUpate) {
                    var role = rolesToUpate[roleName];
                    if (role !== null) {
                        Role.update({name: roleName}, {name: roleName}, function(err, updatedRole) {
                           if (err) {
                               throw err;
                           }
                           //else {
                           //    console.log('[' + (new Date()) + '] ' + roleName + ' role was updated.');
                           //}
                        });
                    } else {
                        role = new Role({name: roleName});
                        role.save(function(err, savedRole) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('[' + (new Date()) + '] ' + savedRole.name + ' role was added.');
                            }
                        });
                    }
                }
            });
        },
        priority: 1
    }
};