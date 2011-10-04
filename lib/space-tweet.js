/**
 * Module dependencies.
 */

var sio = require('socket.io')
  , fs = require('fs')
  , TwitterNode = require('twitter-node').TwitterNode
  , config = JSON.parse(fs.readFileSync('./config.json'));

/**
 * Exports.
 */

module.exports = function (app) {
  var io = sio.listen(app);
  
  
  var twitterStream = new TwitterNode({
    user: config.user,
    password: config.password,
    track: ['good', 'bad', 'lame', 'dumb']
  });
  
  twitterStream.on('tweet', function (tweet) {
    var match = /(good)|(bad)|(lame)|(dumb)/.exec(tweet.text);
    
    if (match) {
      if (match[1]) {
        return io.sockets.emit('bullet');
      }
      
      match = match.slice(2);
      for (var i = 0; i < match.length; i++) {
        if (match[i]) {
          io.sockets.emit('invader', i);
        }
      }
    }
  });
  
  twitterStream.stream();

  return function (req, res) {
    res.render('space');
  };
}