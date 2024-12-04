import axios from "axios";

const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const USERS_API = `${REMOTE_SERVER}/api/users`;

export const fetchAllUsers = async () => {
  const response = await axios.get(USERS_API);
  return response.data;
};