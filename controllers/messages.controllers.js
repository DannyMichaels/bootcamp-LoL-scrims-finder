const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');

const mongoose = require('mongoose');

const handleValidId = async (id, res) => {
  let isValid = mongoose.Types.ObjectId.isValid(id);

  if (!isValid) {
    return res.status(500).json({ error: 'invalid id' });
  }
};

const postMessage = async (req, res) => {
  try {
    const { text, conversationId, senderId } = req.body;

    await handleValidId(conversationId, res);
    await handleValidId(senderId, res);

    const conversation = await Conversation.findById(conversationId);
    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(500).json({ error: 'Sender not found!' });
    }

    if (!text) {
      return res.status(500).json({ error: 'Message text not provided!' });
    }

    if (!conversation) {
      return res.status(500).json({ error: 'Conversation not found!' });
    }

    const newMessage = new Message({
      text,
      _conversation: conversation._id,
      _sender: sender._id,
    });

    let savedMessage = await newMessage.save();

    // make sure we get _sender.name, region, rank etc after creating with populate, or else it will only return id to the client
    savedMessage = await savedMessage
      .populate('_sender', ['name', 'discord', 'rank', 'region'])
      .execPopulate();

    return res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    await Message.find({
      _conversation: req.params.conversationId,
    })
      .populate('_sender', ['name', 'discord', 'region', 'rank'])
      .exec((err, messagesData) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        return res.json(messagesData);
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  postMessage,
  getConversationMessages,
};
