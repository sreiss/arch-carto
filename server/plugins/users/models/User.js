/**
 * User model.
 *
 * @module arch/users
 * @copyright ArchTailors 2015
 */

module.exports = function(Types) {
    return {
        schema:
        {
            oauth: {type: Types.ObjectId, required: true},
            role: {type: Types.ObjectId, ref: 'Role'},
            favoriteCourses: [{type: Types.ObjectId, ref: 'Course'}]
        },
        priority: 2
    };
};