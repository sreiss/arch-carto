/**
 * Role routes.
 *
 * @module arch/users
 * @copyright ArchTailors 2015
 */

module.exports = function(roleController, roleRouter, roleMiddleware) {
    roleRouter.route('/:roleName')
        .get(roleController.getRole);
}