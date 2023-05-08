import { useEffect, useState } from "react";
import axios from "axios";

export const useFetchRecipientUser = ({ chat, userId }) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);
  const recipientId = chat?.members.find((id) => id !== userId);
  console.log(chat);
  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;
      const response = await axios.get(
        `http://localhost:5500/users/find/${recipientId}`
      );
      if (response.error) {
        return setError(error);
      }
      setRecipientUser(response);
    };
    getUser();
  }, []);
  return { recipientUser };
};
