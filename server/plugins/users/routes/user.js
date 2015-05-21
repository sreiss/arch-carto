/**
 * User routes.
 *
 * @module arch/users
 * @copyright ArchTailors 2015
 */

module.exports = function(userController, userRouter, userMiddleware) {
    userRouter.route('/')
        .post(userController.saveUser)
        .put(userController.updateUser);

    userRouter.route('/:oauthUserId')
        .all(userMiddleware.checkOauthUserId)
        .get(userController.getUser)
        .delete(userController.deleteUser);
}