<script setup lang="ts">
import InputName from '../components/InputName.vue';
import { useChats } from '../composables/useChat';
import { useUser } from '../composables/useUser';
import ChatBox from './ChatBox.vue';

const { username, userId, handleNameSubmission } = await useUser();
const {
  chatEntries,
  newChatMessage,
  createNewChatMessage,
  editChatMessage,
  deleteChatMessage,
} = await useChats();

const handleSubmit = (event: Event) => {
  event.preventDefault();
  createNewChatMessage(userId, username.value || '');
};
</script>

<template>
  <template v-if="!username">
    <InputName @submit="handleNameSubmission" />
  </template>

  <template v-else>
    <header class="header">
      <div class="header__name">name: {{ username }}</div>
    </header>

    <main class="main">
      <h1 class="main__title">Chat App</h1>
      <div class="chat">
        <div class="chat__list">
          <template v-for="[chatId, chat] in chatEntries" :key="chatId">
            <ChatBox
              :class="[
                'chat__item',
                chat.senderId === userId && 'chat__item--me',
              ]"
              :chat="chat"
              :chat-id="chatId"
              :user-id="userId"
              :is-me="chat.senderId === userId"
              @edit="editChatMessage"
              @delete="deleteChatMessage"
            />
          </template>
        </div>
        <form class="chat__form chat-form" @submit="handleSubmit">
          <input
            class="chat-form__input"
            v-model="newChatMessage"
            placeholder="Type your message here..."
          />
          <input type="submit" class="chat-form__submit" value="Send" />
        </form>
      </div>
    </main>
  </template>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  padding: 12px;
  border-bottom: 1px solid #aaa;
}

.main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

.chat {
  max-width: 640px;
  margin: 0 auto;
}

.chat__list {
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-block-start: 12px;
  }
}

.chat__item.chat__item--me {
  align-self: flex-end;
}

.chat__form {
  margin-block-start: 20px;
  padding-block-start: 20px;
}

.chat-form {
  height: 2rem;
  display: flex;
  border-top: 1px solid #aaa;
  & > * + * {
    margin-inline-start: 12px;
  }
}

.chat-form__input {
  flex: 1;
}
</style>
