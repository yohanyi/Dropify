Dropify.MessageHandler = function(map) {
  this.map = map;
  this.messages = []
  this.getMessages()
}

Dropify.MessageHandler.prototype = {
  createMessages: function(arrayOfMessages) {
    for (var i = 0; i < arrayOfMessages.length; i++) {
      this.messages.push(new Dropify.Message(arrayOfMessages[i]));
    }
  },

  getMessages: function() {
    Dropify.API.getMessages().then(function(serverData) {
      this.createMessages(serverData)
      this.map.renderMarkers(this.messages)
    }.bind(this))
  },

  createSingleMessage: function(message) {
    Dropify.API.createMessage(message).then(function(serverData) {
      arrayData = [serverData]
      this.createMessages(arrayData)
      this.map.renderMarkers(this.messages[this.messages.length - 1])
    }.bind(this))
  }
}


