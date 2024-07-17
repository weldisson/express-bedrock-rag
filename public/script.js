document.getElementById("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.getElementById("messageInput").value;
  const output = document.getElementById("chatOutput");

  output.innerHTML = ""; 

  fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: input }),
  })
    .then((response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            console.log("Stream complete");
            return;
          }

          const text = decoder.decode(value, { stream: true });
          output.innerHTML += text;
          input.value = '';
          read();
        });
      }

      read();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
