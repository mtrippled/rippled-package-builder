import Events from '../lib/events'

class GithubEvent {
  constructor(payload) {
    this.payload = payload
  }
}

class MergedEvent extends GithubEvent {

}

class PushEvent extends GithubEvent {

  toString() {

    return {
      type: 'PushEvent',
      rel: this.payload.rel,
    }
  }
}

class ReleaseEvent extends GithubEvent {

  toString() {
    return {
      type: 'ReleaseEvent'
    }
  }
}

class PullRequestEvent extends GithubEvent {
  toString() {
    var merged

    if (this.payload.action === 'closed' && this.payload.pull_request.merged) {
      merged = true 
    } else {
      merged = false
    }

    return {
      type: 'PullRequestEvent',
      merged: false
    }
  }
}

function parseEvent(payload) {
  if (payload.ref) {
    Events.emit('push', payload)
    return new PushEvent(payload)

  } else if (payload.action == 'published' && payload.release) {

    Events.emit('release', payload.release)
    return new ReleaseEvent(payload)

  } else if (payload.pull_request) {

    Events.emit('merge', payload)
    return new PullRequestEvent(payload)
  }
}

module.exports = function(models, lib) {

  return {
   github: function(req, res, next) {
      var event = parseEvent(req.body)

      if (event) {
        console.log(event.toString())
      }

      res.status(200).send({
        success: true,
        message: 'Welcome to Bridges'
      })
    }

  }
}

