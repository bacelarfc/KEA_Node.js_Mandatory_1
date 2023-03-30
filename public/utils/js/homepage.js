async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    console.log("Something went wrong.");
  }
  return response.json();
}

async function updateWelcomeMessage() {
  try {
    const data = await fetchData("/get-username");
    const username = data.username;
    const welcomeMessage = document.querySelector("#welcome-message");
    if (welcomeMessage) {
      welcomeMessage.innerHTML = "Welcome, " + username + "!";
    }
  } catch (error) {
    console.error(error);
  }
}

updateWelcomeMessage();