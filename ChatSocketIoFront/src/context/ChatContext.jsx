import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  baseUrl,
  deleteRequest,
  getRequest,
  postRequest,
} from "../utils/services";
import { io } from "socket.io-client";
export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [deletedChat, setDeletedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  //socketIo

  useEffect(() => {
    const newSocket = io("https://socketioserverchat.onrender.com");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);
  //add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);
  //send message

  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);
  //recieveMessage and notification

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });
    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("Error fetching users ", response);
      }

      const pChats = response?.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u?._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat?.members[0] === u._id || chat?.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatsLoading(true);
      setUserChatsError(null);
      if (user?._id) {
        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user, notifications]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);
  //get messages
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setIsMessagesLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    };

    getMessages();
  }, [currentChat]);
  //create chat

  const createChat = useCallback(async (firstId, secondId, setBtnSelected) => {
    setBtnSelected(true);
    const response = await postRequest(
      `${baseUrl}/chats/`,
      JSON.stringify({ firstId, secondId })
    );
    setBtnSelected(false);
    if (response.error) {
      return console.log("error creating chat", response);
    }
    setUserChats((prev) => [...prev, response]);
  }, []);

  //delete chat

  const deleteChat = useCallback(async (chatId, setIsDeleted) => {
    setIsDeleted(true);
    const response = await deleteRequest(`${baseUrl}/chats/${chatId}`);
    if (response.error) {
      return console.log("error deleting chat", response);
    }
    setIsDeleted(false);
    setDeletedChat(chatId);
  }, []);

  useEffect(() => {
    if (deletedChat) {
      setUserChats((prevChats) =>
        prevChats.filter((chat) => chat._id !== deletedChat)
      );
      if (userChats.length > 0) {
        setCurrentChat(userChats[userChats.length - 1]);
      }
    }
  }, [deletedChat, currentChat]);

  // const sendTextMessage = useCallback(
  //   async (
  //     textMessage,
  //     sender,
  //     currentChatId,
  //     setTextMessage,
  //     image,
  //     setImage
  //   ) => {
  //     if (!textMessage && !image) {
  //       return console.log("You must type something or send an image");
  //     }
  //     const response = await postRequest(
  //       `${baseUrl}/messages`,
  //       JSON.stringify({
  //         chatId: currentChatId,
  //         senderId: sender._id,
  //         text: textMessage,
  //         image: image ? image : null,
  //       })
  //     );
  //     if (response.error) {
  //       return setSendTextMessageError(response);
  //     }
  //     setNewMessage(response);
  //     setMessages((prev) => [...prev, response]);
  //     setTextMessage("");
  //     setImage(null);
  //   },
  //   []
  // );
  const sendTextMessage = useCallback(
    async (
      textMessage,
      sender,
      currentChatId,
      setTextMessage,
      image,
      setImage,
      setPreview,
      setIsSending
    ) => {
      if (!textMessage && !image) {
        return console.log("You must type something or send an image");
      }

      const formData = new FormData();
      formData.append("chatId", currentChatId);
      formData.append("senderId", sender._id);
      formData.append("text", textMessage);
      if (image) {
        formData.append("image", image);
      }
      setIsSending(true);
      const response = await axios.post(`${baseUrl}/messages`, formData);
      if (response.error) {
        return setSendTextMessageError(response);
      }

      setNewMessage(response.data);
      setMessages((prev) => [...prev, response.data]);
      setTextMessage("");
      setImage(null);
      setPreview(null);
      setIsSending(false);
    },
    []
  );

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, []);
  const markNotificationAsRead = useCallback(
    (notification, userChats, user, notifications) => {
      //find chat to open
      const chatDesired = userChats.find((chat) => {
        const chatMembers = [user._id, notification.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      //mark notifications as read
      const modifyNotifications = notifications.map((notif) => {
        if (notification.senderId === notif.senderId) {
          return { ...notification, isRead: true };
        } else {
          return notif;
        }
      });
      updateCurrentChat(chatDesired);
      setNotifications(modifyNotifications);
    },
    []
  );
  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      const mNotifications = notifications.map((not) => {
        let notification;
        thisUserNotifications.forEach((n) => {
          if (n.senderId === not.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = not;
          }
        });
        return notification;
      });
      setNotifications(mNotifications);
    },
    []
  );
  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        deleteChat,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
