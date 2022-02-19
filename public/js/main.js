const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
// Join chatroom
socket.emit("joinRoom", { username, room });
console.log(socket);

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("notice", (msg) => {
  console.log(msg);
  outputNotice(msg);
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  const className = message.socketId === socket.id ? "self" : "other";

  div.classList.add("message");
  div.classList.add(className);
  const avatarContainerDiv = document.createElement("div");
  const avatarDiv = document.createElement("div");
  avatarContainerDiv.classList.add("avatar-container");
  avatarDiv.classList.add("avatar");
  avatarContainerDiv.appendChild(avatarDiv);
  avatarDiv.innerText = message.username[0];
  div.appendChild(avatarContainerDiv);

  const messageContainerDiv = document.createElement("div");
  messageContainerDiv.classList.add("message-container");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  // p.innerHTML += `<span>${message.time}</span>`;
  messageContainerDiv.appendChild(p);

  const para = document.createElement("span");
  para.classList.add("text");
  para.innerText = message.text;

  const invisibleDiv = document.createElement("div");
  invisibleDiv.classList.add("invisible");

  messageContainerDiv.appendChild(para);
  messageContainerDiv.appendChild(invisibleDiv);

  const timeDiv = document.createElement("div");
  timeDiv.classList.add("time-container");
  timeDiv.innerHTML = `<small class="time">${message.time}</small>`;

  messageContainerDiv.appendChild(timeDiv);

  div.appendChild(messageContainerDiv);

  document.querySelector(".chat-messages").appendChild(div);
}

function outputNotice(message) {
  const div = document.createElement("div");
  div.classList.add("notice-container");
  const p = document.createElement("small");
  p.classList.add("notice");
  p.innerText = message;
  div.appendChild(p);
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  } else {
  }
});
document.getElementById("msg").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.value.trim() !== "") {
    console.log(e);
    socket.emit("chatMessage", e.target.value.trim());

    // Clear input
    e.target.value = "";
    e.target.focus();
  }
});
document.getElementById("msg").focus();
