/**
 * Role controller.
 *
 * @module arch/users
 * @copyright ArchTailors 2015
 */

var ArchSaveError = GLOBAL.ArchSaveError;
var ArchFindError = GLOBAL.ArchFindError;
var ArchDeleteError = GLOBAL.ArchDeleteError;

module.exports = function(roleService) {
    return {
        /** Get role's informations. */
        getRole: function(req, res)
        {
            // Get user id.
            var roleName = req.params.roleName;

            // Get user.
            roleService.getRole(roleName).then(function(result)
            {
                res.status(result ? 200 : 204).json({"count": (result ? 1 : 0), "data": result});
            })
            .catch(function(err)
            {
                res.status(500).json({"error" : new ArchFindError(err.message)});
            });
        }
    };
};
