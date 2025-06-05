document.addEventListener('DOMContentLoaded', function() {
    try {
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');

        if (!chatMessages) throw new Error("Не найден элемент chat-messages");
        if (!userInput) throw new Error("Не найден элемент user-input");
        if (!sendButton) throw new Error("Не найден элемент send-button");

        let isRequestInProgress = false;

        chatMessages.innerHTML = '';

        function addMessage(content, isUser) {
            if (!content || content.trim() === '') return;

            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = content;

            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTypingIndicator() {
            if (document.getElementById('typing-indicator')) return;

            const typingDiv = document.createElement('div');
            typingDiv.className = 'message ai-message';
            typingDiv.id = 'typing-indicator';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content typing-indicator';
            contentDiv.innerHTML = '<span></span><span></span><span></span>';

            typingDiv.appendChild(contentDiv);
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) typingIndicator.remove();
        }

        async function getOpenAIResponse(message) {
    if (isRequestInProgress) {
        return "Пожалуйста, подождите завершения предыдущего запроса";
    }

    isRequestInProgress = true;
    showTypingIndicator();

    try {
        if (!message || message.trim() === '') {
            throw new Error("Пустое сообщение");
        }

        console.log("Отправка запроса к OpenAI:", message.substring(0, 20) + "...");

        const response = await fetch('http://localhost:8080/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            let errorMessage = `Ошибка API: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error?.message) {
                    errorMessage += ` - ${errorData.error.message}`;
                }
            } catch (e) {
                errorMessage += ' (невозможно прочитать тело ошибки)';
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error("Неверный формат ответа от API");
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Ошибка запроса:", error);
        return "Извините, произошла ошибка: " + error.message;
    } finally {
        hideTypingIndicator();
        isRequestInProgress = false;
    }
}

        async function sendMessage() {
            try {
                const message = userInput.value.trim();

                if (!message || isRequestInProgress) return;

                addMessage(message, true);
                userInput.value = '';

                userInput.disabled = true;
                sendButton.disabled = true;

                const response = await getOpenAIResponse(message);
                addMessage(response, false);
            } catch (error) {
                console.error("Ошибка отправки:", error);
                addMessage("Произошла ошибка при отправке сообщения", false);
            } finally {
                userInput.disabled = false;
                sendButton.disabled = false;
                userInput.focus();
            }
        }

        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });

        addMessage("Привет! Я ваш AI-ассистент. Чем могу помочь?", false);

        console.log("Чат успешно инициализирован с OpenAI API");
    } catch (error) {
        console.error("Фатальная ошибка инициализации:", error);
        alert("Ошибка загрузки чата: " + error.message);
    }
});