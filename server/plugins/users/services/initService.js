/**
 * Init service.
 *
 * @module arch/oauth
 * @copyright ArchTailors 2015
 */

var Q = require('q');

module.exports = function(User, Role)
{
    var initTasks =
    {
        createSuperAdminProfile: function()
        {
            Role.findOne({name : "ADMIN"}, function(err, role)
            {
                if(err)
                {
                    console.log('INIT[createSuperAdminProfile] : An error occured while retrieving ADMIN role.');
                }
                else
                {
                    User.findOne({oauth : "55819376e6d994c34a25865c"}, function(err, user)
                    {
                        if(!user)
                        {
                            var user = new User(
                            {
                                oauth : "55819376e6d994c34a25865c",
                                role : role._id
                            });

                            user.save(function(err, user)
                            {
                                if(err)
                                {
                                    console.log('INIT[createSuperAdminProfile] : An error occured while saving SUPERADMIN profile.');
                                }
                                else
                                {
                                    console.log('INIT[createSuperAdminProfile] : SUPERADMIN profile successfully created.');
                                }
                            });
                        }
                        else
                        {
                            console.log('INIT[createSuperAdminProfile] : SUPERADMIN profile already exists.');
                        }
                    });
                }
            });
        }
    };

    initTasks.createSuperAdminProfile();

    return initTasks;
};