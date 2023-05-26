// export const baseUrl = "http://localhost:5500";
export const baseUrl = "https://chatback-olag.onrender.com";
export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  const data = await response.json();
  if (!response.ok) {
    let message;
    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }
    return {
      error: true,
      message,
    };
  }
  return data;
};
export const getRequest = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    let message = "An error occurred";
    if (data?.message) {
      message = data.message;
    }
    return { error: true, message };
  }
  return data;
};
export const deleteRequest = async (url) => {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    let message = "An error occurred";
    if (data?.message) {
      message = data.message;
    }
    return { error: true, message };
  }
  return data;
};
