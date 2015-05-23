var broadway = require('broadway'),
    app = new broadway.App(),
    path = require('path'),
    arch = require(path.join(__dirname, 'core', 'arch'));

app.use(arch);

app.init(function (err) {
    if (err)
        throw err;

    console.log('App started successfully.');
});