import avarter from "../../assets/avarter.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { deleteChat } from "../../features/chatSlice";
import { useDispatch } from "react-redux";
const UserChat = ({ chat, userId, usersOnline }) => {
  const [recipientUser, setRecipientUser] = useState(null);

  const [error, setError] = useState(null);
  const recipientId = chat?.members.find((id) => id !== userId);
  const isOnline = usersOnline?.some((user) => user?.userId === recipientId);
  const dispatch = useDispatch();
  const handleDeleteChat = (id) => {
    dispatch(deleteChat(id));
  };
  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;
      const response = await axios.get(
        `http://localhost:5500/users/find/${recipientId}`
      );

      if (response.error) {
        return setError(error);
      }
      setRecipientUser(response.data);
    };
    getUser();
  }, []);

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div>
          <button onClick={() => handleDeleteChat(chat._id)}>x</button>
        </div>
        <div className="me-2">
          <img src={avarter} height="35px" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">Text Message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">04/21/2023</div>
        <div className="this-user-notifications">2</div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
