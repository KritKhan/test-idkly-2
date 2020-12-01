import client from "./httpClient";

interface props {
  link_original: string;
  link_shorten: string;
}

interface ShortenData {
  link_shorten: string;
  link_original: string;
  link_created_datetime: string;
  link_user: number;
  link_access: number;
}

interface LogResponse {
  access_log_shorten_url: string;
  access_data: {
    access_date: string;
    access_count: number;
  }[];
}

const shorten = async (url: props): Promise<string> => {
  const body = url;
  return await client
    .post("api/link/", body)
    .then((response) => {
      // console.log(response);
      if (response.status === 200) {
        return response.data;
      }
      throw Error(response.toString());
    })
    .catch((error) => {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        return "incorrect";
      } else if (error.response) {
        return "";
      }
      throw error;
    });
};

const getShortenLink = (): Promise<Array<ShortenData>> => {
  return client.get("api/link").then((response) => {
    if (response.status === 200) {
      return response.data;
    }
  });
};

const deleteLink = (link: string): Promise<number> => {
  return client
    .delete(`/api/link/${link}/`)
    .then((response) => {
      if (response.status === 204 || response.status === 200) {
        return response.status;
      }
      return 0;
    })
    .catch((error) => {
      if (error.response) {
        return error.response.status;
      }
    });
};

const getAccessLog = (): Promise<LogResponse[]> => {
  return client.get("/api/accesslog").then((response) => {
    if (response.status === 200) {
      return response.data;
    }
  });
};

export { shorten, getShortenLink, deleteLink, getAccessLog };
