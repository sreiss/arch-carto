module.exports = function(coatingController, coatingRouter)
{
    coatingRouter.route('/')
        .get(coatingController.getList)
        .post(coatingController.save);
};