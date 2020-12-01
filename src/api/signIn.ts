import client from "./httpClient";
import { setToken } from "helpers/Auth";

export interface Props {
  usernameEmail: string;
  password: string;
}

const signIn = async (props: Props): Promise<boolean> => {
  const body = {
    user_name: props.usernameEmail,
    password: props.password,
  };
  return await client
    .post("api/signin/", body)
    .then((response) => {
      if (response.status === 200) {
        const token = `Bearer ${response.data.access}`;
        setToken(token);

        return true;
      }
      throw Error(response.toString());
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        return false;
      }
      throw error;
    });
};

export default signIn;
