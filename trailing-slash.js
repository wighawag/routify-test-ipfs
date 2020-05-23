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
        const length = redirectToUrl.length;
        if (length == 0) {
            redirectToUrl = "/"
        } else if (redirectToUrl[length - 1] != "/") {
            redirectToUrl += "/";
        }
        if (redirectToUrl !== ctx.request.href) {
            ctx.redirect(redirectToUrl)
        }
        await next()
        }
    }
}

module.exports = Redirect
