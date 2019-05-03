export default class FetchApi {
  static getUrl() {
    return 'http://localhost:3030';
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static setToken(token) {
    localStorage.setItem('token', token);
  }

  static removeToken() {
    localStorage.removeItem('token');
  }

  static async post(path, data, options = {}) {
    return await FetchApi.request(path, 'POST', data, options);
  }

  static async get(path, data, options = {}) {
    return await FetchApi.request(path, 'GET', data, options);
  }

  static async put(path, data, options = {}) {
    return await FetchApi.request(path, 'PUT', data, options);
  }

  static async patch(path, data, options = {}) {
    return await FetchApi.request(path, 'PATCH', data, options);
  }

  static async delete(path, data, options = {}) {
    return await FetchApi.request(path, 'DELETE', data, options);
  }

  static async request(path, method, data, options = {}) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FetchApi.getToken()}`,
    });

    const myInit = {
      method,
      headers,
      body: JSON.stringify(data)
    };

    return await fetch(`${FetchApi.getUrl()}${path}`, myInit).then(res => {
      return res.json().
        then(json => {
          if (res.status >= 200 && res.status < 300) {
            return Promise.resolve({data: json});
          } else {
            return Promise.reject({data: json});
          }
        }).
        catch(e => {
          return Promise.reject(e);
        });
    }).catch(e => {
      return Promise.reject(e);
    });
  }

  static async upload(data, options = {}) {
    let headers = new Headers({
      'Authorization': `Bearer ${FetchApi.getToken()}`,
    });

    let body = new FormData();
    for(let key in data) {
      body.append(key, data[key]);
    }

    const myInit = {
      method: 'POST',
      headers,
      body
    };

    return await fetch(`${FetchApi.getUrl()}/api/media/upload`, myInit).then(res => {
      return res.json().
        then(json => {
          if (res.status >= 200 && res.status < 300) {
            return Promise.resolve({data: json});
          } else {
            return Promise.reject({data: json});
          }
        }).
        catch(e => {
          return Promise.reject(e);
        });
    }).catch(e => {
      return Promise.reject(e);
    });
  }
}
