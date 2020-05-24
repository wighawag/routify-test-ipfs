const fs = require("fs");
const path = require("path");
const EventEmitter = require('events')

class Redirect extends EventEmitter {
  description () {
    return 'Perform a 302 Redirect if the request URL does not have a trailing slash to add one'
  }

  optionDefinitions () {
    return []
  }

  middleware (config) {
    return async function (ctx, next) {
        let redirectToUrl = ctx.request.href;
        const doubleSLashIndex = redirectToUrl.indexOf("//");
        let urlWithoutProtocol;
        if (doubleSLashIndex >= 0) {
          urlWithoutProtocol = redirectToUrl.slice(doubleSLashIndex+2);
        } else {
          urlWithoutProtocol = redirectToUrl;
        }
        const firsSlashIndex = urlWithoutProtocol.indexOf("/");
        if (firsSlashIndex !== -1) {
          let filepath = urlWithoutProtocol.slice(firsSlashIndex+1);
          if (config.directory) {
            filepath = path.join(config.directory, filepath);
          }
          if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            if (stats.isDirectory()) {
              const length = redirectToUrl.length;
              if (length == 0) {
                  redirectToUrl = "/"
              } else if (redirectToUrl[length - 1] != "/") {
                  redirectToUrl += "/";
              }
              if (redirectToUrl !== ctx.request.href) {
                  ctx.redirect(redirectToUrl)
              }
            }
          }
        }
        await next()
        }
    }
}

module.exports = Redirect
