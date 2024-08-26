<script setup lang="ts">
import { ref } from 'vue';
import { Chat } from '../composables/useChat';

const props = defineProps<{
  chat: Chat;
  chatId: string;
  userId: string;
  isMe: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit', chatId: string, message: string): void;
  (e: 'delete', chatId: string): void;
}>();

const isEditing = ref(false);
const message = ref(props.chat.message);

const handleSave = () => {
  emit('edit', props.chatId, message.value);
  isEditing.value = false;
};

const handleDelete = () => {
  emit('delete', props.chatId);
};
</script>
<template>
  <div :class="['chatbox', isMe && 'chatbox--me']">
    <template v-if="isMe">
      <button class="chatbox__action-btn" @click="handleDelete">Delete</button>
      <button class="chatbox__action-btn" @click="isEditing = !isEditing">
        {{ !isEditing ? 'Edit' : 'Cancel' }}
      </button>
    </template>

    <template v-if="isEditing">
      <form @submit.prevent="handleSave" class="chatbox__edit-form">
        <textarea v-model="message" />
        <button class="chatbox__action-btn chatbox__action-btn--emphasize">
          Save
        </button>
      </form>
    </template>

    <template v-else>
      <div class="chatbox__container">
        <div class="chatbox__name">{{ chat.senderUsername }}</div>
        <div class="chatbox__message">{{ chat.message }}</div>
      </div>
      <span class="chatbox__edited-label" v-if="!!chat.editedAt">edited</span>
    </template>
  </div>
</template>
<style scoped>
.chatbox,
.chatbox__edit-form {
  display: flex;
  & > * + * {
    margin-inline-start: 8px;
  }
}

.chatbox {
  align-items: flex-end;
}

.chatbox.chatbox--me {
  text-align: right;
  justify-content: flex-end;
}

.chatbox__action-btn,
.chatbox__edited-label {
  font-size: 0.75rem;
}

.chatbox__action-btn {
  /* reset */
  background-color: transparent;
  border: none;
  padding: 0;

  align-self: flex-end;
  cursor: pointer;
  color: #555555;
  text-decoration: underline;
}

.chatbox__action-btn.chatbox__action-btn--emphasize {
  color: #cccccc;
}

.chatbox__container {
  padding: 12px;
  background-color: #040404;
  border-radius: 4px;
  max-width: 75%;
}

.chatbox--me .chatbox__container {
  background-color: #4f4f4f;
}

.chatbox__name {
  font-weight: bold;
  font-size: 0.75rem;
}
</style>
