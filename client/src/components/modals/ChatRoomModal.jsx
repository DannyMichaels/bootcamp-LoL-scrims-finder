// hooks
import { useCallback, useState, useEffect, useRef, useMemo, memo } from 'react';
import useAlerts from '../../hooks/useAlerts';
import useUsers from '../../hooks/useUsers';
import useSocket from '../../hooks/useSocket';
import useAuth from '../../hooks/useAuth';

// components
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import { Helmet } from 'react-helmet';
import Moment from 'react-moment';
import 'moment-timezone';

// services
import { getConversationMessages } from '../../services/messages.services';
import { postNewMessage } from '../../services/messages.services';

// icons
import CreateIcon from '@mui/icons-material/Create';
import Tooltip from '../shared/Tooltip';

// utils
import { getRankImage } from '../../utils/getRankImage';
import makeStyles from '@mui/styles/makeStyles';
import devLog from '../../utils/devLog';
import { Modal } from '../shared/ModalComponents';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ChatBubble from './../Messenger_components/ChatBubble';

// messenger modal chat room
export default function ChatRoomModal() {
  const { allUsers } = useUsers();
  const { currentUser } = useAuth();
  const { chatRoomOpen } = useSelector(({ general }) => general);

  const { conversation = null, isOpen: open = false } = chatRoomOpen;
  const dispatch = useDispatch();

  const onClose = () =>
    dispatch({
      type: 'general/chatRoomOpen',
      payload: { conversation: null, isOpen: false },
    });

  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(''); // the user input field new message to be sent
  const [arrivalMessage, setArrivalMessage] = useState(null); // new message that will be received from socket

  const { socket } = useSocket();

  const conversationMemberIds = useMemo(
    () => conversation?.members?.map(({ _id }) => _id),
    [conversation?.members]
  );

  const scrollRef = useRef(); // automatically scroll to bottom on new message created.

  const classes = useStyles();

  const { setCurrentAlert } = useAlerts();

  useEffect(() => {
    if (!open) return;
    // take event from server
    socket.current?.on('getMessage', (data) => {
      devLog('getMessage event: ', data);
      setArrivalMessage({
        _sender: allUsers.find((user) => user._id === data.senderId),
        text: data.text,
        createdAt: data.createdAt,
        _id: data.messageId,
      });
    });
  }, [allUsers, socket, open]);

  useEffect(() => {
    // fetch messages by conversationId and set in the state.
    const fetchMessages = async () => {
      const messagesData = await getConversationMessages(conversation?._id);
      setMessages(
        messagesData.sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        })
      );

      setIsLoaded(true);
    };

    fetchMessages();

    // reset on component unmount
    return () => {
      setIsLoaded(false);
      setMessages([]);
    };
  }, [conversation?._id]);

  useEffect(() => {
    // doing this so we don't see this message at conversations that aren't this one

    if (
      arrivalMessage &&
      conversationMemberIds?.includes(arrivalMessage?._sender?._id)
    ) {
      devLog('socket new arrival message added to state (receiver client)');
      setMessages((prevState) => [...prevState, arrivalMessage]);
    }
  }, [arrivalMessage, conversationMemberIds]);

  const handleSubmitMessage = useCallback(
    async (msgText) => {
      try {
        const newlyCreatedMessage = await postNewMessage({
          senderId: currentUser?._id,
          conversationId: conversation?._id,
          text: msgText,
        });

        const receiver = conversation?.members?.find(
          (user) => user._id !== currentUser?._id
        );

        // send event to server after creating on client and posting to api
        devLog('EMIT'); // emits only once

        socket.current?.emit('sendMessage', {
          senderId: currentUser?._id,
          text: msgText,
          receiverId: receiver._id,
          messageId: newlyCreatedMessage._id,
          createdAt: newlyCreatedMessage.createdAt,
        });

        setMessages((prevState) => [...prevState, newlyCreatedMessage]);

        setNewMessage('');
      } catch (error) {
        const errorMsg =
          error?.response?.data?.error ??
          'error sending message, try again later';

        setCurrentAlert({
          type: 'Error',
          message: errorMsg,
        });
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser?._id, conversation?._id]
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!open) return;
    if (!scrollRef?.current) return;

    const scroll = scrollRef?.current;
    scroll.scrollTop = scroll?.scrollHeight;

    scroll.animate({ scrollTop: scroll?.scrollHeight }); // automatically scroll to bottom on new message created and mount

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoaded, open]);

  const handleChange = useCallback((e) => setNewMessage(e.target.value), []);

  if (!open) return null;

  return (
    <Modal
      title={`Messenger Chat (${conversation?.members[0]?.name} & ${conversation?.members[1]?.name})`}
      customStyles={{}}
      contentClassName={classes.modalContent}
      open={open}
      onClose={onClose}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          Messenger: {conversation?.members[0]?.name} &&nbsp;
          {conversation?.members[1]?.name} | Bootcamp LoL Scrim Gym
        </title>
      </Helmet>
      {!isLoaded || !conversation?._id ? (
        <div
          style={{
            padding: '50px',
            margin: '100px 0',
          }}>
          <LinearProgress />
        </div>
      ) : (
        <div
          style={{
            minWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div className={classes.chatRoomMessagesContainer} ref={scrollRef}>
            {messages.map((message) => (
              // one message
              <ChatBubble
                isCurrentUser={message._sender._id === currentUser?._id}
                key={message._id}
                messageText={message.text}
                userName={message._sender.name}
                userRank={message._sender.rank}
                messageDate={message.createdAt}
              />
            ))}
          </div>

          <ChatInput
            value={newMessage}
            onChange={handleChange}
            onSubmit={handleSubmitMessage}
          />
        </div>
      )}
    </Modal>
  );
}

// one message
const ChatBubble2 = ({
  isCurrentUser,
  messageText,
  messageDate,
  userName,
  userRank,
}) => {
  const classes = useStyles({ isCurrentUser });
  const rankImage = getRankImage(userRank);

  return (
    <div className={classes.bubbleContainer}>
      <div className={classes.bubbleUsername}>
        <img src={rankImage} width="20px" alt={`${userName}'s rank`} />
        {userName}
      </div>
      <div className={classes.bubble}>
        <div className={classes.button}>{messageText}</div>
      </div>
      <div className={classes.bubbleMessageDate}>
        {/* Including ago with fromNow will omit the suffix from the relative time. */}
        <Moment fromNow>{messageDate}</Moment>
      </div>
    </div>
  );
};

const ChatInput = memo(({ value, onChange, onSubmit }) => {
  return (
    <OutlinedInput
      multiline
      className="_draggable__input"
      minRows={2}
      maxRows={4}
      sx={{ marginTop: 4, width: '98%' }} // this width also expands the width of the modal (as wanted tbh)
      placeholder="new message"
      value={value}
      onChange={onChange}
      endAdornment={
        <InputAdornment position="end">
          <Tooltip title="Send message">
            <IconButton onClick={() => onSubmit(value)}>
              <CreateIcon />
            </IconButton>
          </Tooltip>
        </InputAdornment>
      }
    />
  );
});

const useStyles = makeStyles((theme) => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
    maxWidth: '600px',
    maxHeight: '100%', // 100% to follow chat bubble overflow instead.
    overflowWrap: 'break-word',
  },

  chatRoomMessagesContainer: {
    maxHeight: '300px',
    overflowY: 'auto',
  },

  bubbleContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column', // column because name is ontop of bubble, and time sent is below.

    // if user sent message is the current user, align it to flex-end, else flex-start
    alignItems: ({ isCurrentUser }) =>
      isCurrentUser ? 'flex-end' : 'flex-start',
    padding: '15px',
  },

  bubbleUsername: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px 0px',
    position: 'relative',
    left: ({ isCurrentUser }) => (isCurrentUser ? '-5px' : '5px'),
    top: '5px',
  },

  bubbleMessageDate: {
    fontSize: '0.7rem',
    maxWidth: '30%',
    wordBreak: 'break-word',
    position: 'relative',
    left: ({ isCurrentUser }) => (isCurrentUser ? '-5px' : '5px'),
  },

  bubble: {
    maxWidth: '35%',
    minWidth: '20%',
    border: '0.5px solid black',
    borderRadius: '10px',
    margin: '5px 0',
    padding: '10px',
    color: ({ isCurrentUser }) => (isCurrentUser ? 'white' : 'black'),
    backgroundColor: ({ isCurrentUser }) => (isCurrentUser ? 'blue' : 'white'),
  },
}));