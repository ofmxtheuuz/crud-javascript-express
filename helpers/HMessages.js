const chalk = require("chalk")

module.exports = {

    server: function (msg) {
        console.log(chalk.blue(`[Servidor] `) + msg)
    },

    error: function(err) {
        console.log(chalk.red(`[Error] `) + err)
    },

    database: function(msg) {
        console.log(chalk.green(`[MongoDB] `) + msg)
    }

}