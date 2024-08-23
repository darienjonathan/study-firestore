<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'submit', name: string): void;
}>();

const name = ref();

const handleSubmit = (e: Event) => {
  e.preventDefault();
  emit('submit', name.value);
};
</script>
<template>
  <div class="wrapper">
    <form class="input" @submit="handleSubmit">
      <div class="input-name__input">
        <label for="name" class="input-name__label">name:</label>
        <input id="name" class="input-name__text-input" v-model="name" />
      </div>
      <input type="submit" class="input-name__submit" value="Submit" />
    </form>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  align-items: center;
}

.input {
  padding: 20px;
  border: 1px solid #aaa;
}

.input-name {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  & > * + * {
    margin-block-start: 12px;
  }
}

.input-name__input {
  & > * + * {
    margin-inline-start: 8px;
  }
}
</style>
