import server from "./server";

export async function getMe() {
  try {
    const response = await server.get("/users/me")
    return response.data;
  } catch (err) {
    console.error('Error details:', err.response?.data);
    return { error: true, message: err.response?.data?.message };
  }
}

export async function signin(login, password) {
  try {
    await server.post("/auth/login", {
      emailorlogin: login,
      password: password
    })
    return true;
  } catch (err) {
    console.error('Error details:', err.response?.data);
    return { error: true, message: err.response?.data?.message };
  }
}

export async function signup(name, email, login, password) {
  try {
    await server.post("auth/register", {
      login: login,
      username: name,
      email: email,
      password: password
    })
    return true;
  } catch (err) {
    console.error('Error details:', err.response?.data);
    return { error: true, message: err.response?.data?.message };
  }
}

export async function logout() {
  try {
    await server.post("/auth/logout")
    return true;
  } catch (err) {
    console.error('Error details:', err.response?.data);
    return { error: true, message: err.response?.data?.message };
  }
}

export async function signInTest() {
  try {
    await server.post("/auth/login", {
      emailorlogin: "test@test.ru",
      password: "Nevebicheskiy_method"
    });

    return true;
  } catch (err) {

    await server.post("/auth/register", {
      login: "leonid",
      username: "Pupsik",
      email: "test@test.ru",
      password: "Nevebicheskiy_method"
    });

    return false;
  }
}