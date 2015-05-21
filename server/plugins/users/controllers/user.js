/**
 * User controller.
 *
 * @module arch/users
 * @copyright ArchTailors 2015
 */

var ArchSaveError = GLOBAL.ArchSaveError;
var ArchFindError = GLOBAL.ArchFindError;
var ArchDeleteError = GLOBAL.ArchDeleteError;

module.exports = function(userService) {
    return {
        /** Save user. */
        saveUser: function(req, res)
        {
            // Get posted user.
            var user = req.body;

            // Saving user.
            userService.saveUser(user).then(function(result)
            {
                res.status(201).json({"count": (result ? 1 : 0), "data": result});
            })
            .catch(function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
            });
        },

        /** Update user. */
        updateUser: function(req, res)
        {
            // Get posted user.
            var user = req.body.user;

            // Saving user.
            userService.updateUser(user).then(function(result)
            {
                res.status(200).json({"count": (result ? 1 : 0), "data": result});
            })
            .catch(function(err)
            {
                res.status(500).json({"error" : new ArchSaveError(err.message)});
            });
        },

        /** Get user's informations. */
        getUser: function(req, res)
        {
            // Get user id.
            var id = req.params.oauthUserId;

            // Get user.
            userService.getUser(id).then(function(result)
            {
                res.status(result ? 200 : 204).json({"count": (result ? 1 : 0), "data": result});
            })
            .catch(function(err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        },

        /** Delete user. */
        deleteUser: function(req, res)
        {
            // Get user id.
            var id = req.params.oauthUserId;

            // Delete user.
            userService.deleteUser(id).then(function(result)
            {
                res.status(result ? 200 : 204).json({"count": (result ? 1 : 0), "data": result});
            })
            .catch(function(err)
            {
                res.status(500).json({"error" : new ArchDeleteError(err.message)});
            });
        }
    };
};
