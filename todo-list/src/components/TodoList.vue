<script setup>
import { ref } from 'vue'

const newTodo = ref('')
const todos = ref([])

function addTodo() {
  if (newTodo.value !== '') {
    todos.value.push(newTodo.value)
    newTodo.value = ''
  }
}
</script>

<template>
  <div>
    <input type="text" v-model="newTodo" @keyup.enter="addTodo" />
    <ul>
      <li v-for="(todo, index) in todos" :key="index">{{ todo }}</li>
    </ul>
  </div>
</template>
