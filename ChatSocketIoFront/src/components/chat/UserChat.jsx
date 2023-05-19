import avarter from "../../assets/avarter.svg";
import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, deleteChat } = useContext(ChatContext);
  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div className="color-[#a92727]">
          <span
            className="color-[#575555df] bg-transparent"
            onClick={() => deleteChat(chat._id)}
          >
            x
          </span>
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
        <span className={isOnline ? "user-online" : "user-offline"}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
