import client from "./httpClient"

interface props {
  user_name: string;
  password: string;
  user_email: string;
}

const signUp = async (signupData: props) : Promise<boolean> => {
  const body = signupData;
  return await client
  .post("api/signup/", body)
  .then((response) => {
    console.log(response);
    if (response.status === 200) {
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

export default signUp;