const myAxios = {
  request: async function ({ url, method = "GET", data = null, headers = {} }) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get("Content-Type");

      const result =
        contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();

      if (!response.ok) {
        throw { status: response.status, data: result };
      }

      return { status: response.status, data: result };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  get(url, headers = {}) {
    return this.request({ url, method: "GET", headers });
  },

  post(url, data = {}, headers = {}) {
    return this.request({ url, method: "POST", data, headers });
  },

  put(url, data = {}, headers = {}) {
    return this.request({ url, method: "PUT", data, headers });
  },

  delete(url, headers = {}) {
    return this.request({ url, method: "DELETE", headers });
  },
};

export default myAxios;
