document.getElementById("chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const input = document.getElementById("messageInput").value;
  const output = document.getElementById("chatOutput");
  const messageInput = document.getElementById("messageInput");

  messageInput.value = '';

  output.innerHTML += `<div class="p-2 bg-gray-700 rounded mb-2"><strong>Você:</strong> ${input}</div>`;

  const chatGPTMessage = document.createElement('div');
  chatGPTMessage.classList.add('p-2', 'bg-gray-700', 'rounded', 'mb-2');
  chatGPTMessage.innerHTML = `<strong>AI:</strong> <div class="output-text"></div>`;
  output.appendChild(chatGPTMessage);

  const outputText = chatGPTMessage.querySelector('.output-text');

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: input }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let markdownText = '';

    async function read() {
      const { done, value } = await reader.read();
      if (done) {
        outputText.innerHTML = marked.parse(markdownText);
        console.log("Stream complete");
        return;
      }

      const text = decoder.decode(value, { stream: true });
      markdownText += text;

      outputText.innerHTML = marked.parse(markdownText);

      read();
    }

    read();
  } catch (error) {
    console.error("Error:", error);
    output.innerHTML += `<div class="p-2 bg-red-700 rounded mb-2"><strong>Error:</strong> ${error.message}</div>`;
  }
});
