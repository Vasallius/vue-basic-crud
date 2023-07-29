<template>
  <div>
    <input type="text" name="addTodo" v-model="todo" placeholder="add new todo.." />
    <button @click="addTodo">Add</button>
  </div>
  <div v-for="todoItem in todos" :key="todoItem.id">
    <button @click="editTodo(todoItem)">Edit</button>
    <button @click="removeTodo(todoItem.id)">Clear Todo</button>
    <input v-if="editingTodo === todoItem.id" type="text" v-model="todoItem.text" />
    <span v-else>{{ todoItem.text }}</span>
    <button v-if="editingTodo === todoItem.id" @click="updateTodo">Save</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const todo = ref('')
const todos = ref([
  {
    id: 1,
    text: 'Learn Vue 3',
    done: true
  },
  {
    id: 2,
    text: 'Learn TypeScript',
    done: false
  }
])
const editingTodo = ref(null)

function removeTodo(id) {
  todos.value = todos.value.filter((todo) => todo.id !== id)
}

function addTodo() {
  if (todo.value.length === 0) {
    return
  }
  todos.value.push({
    id: todos.value.length + 1,
    text: todo.value,
    done: false
  })
  todo.value = ''
}

function editTodo(todoItem) {
  editingTodo.value = todoItem.id
}

function updateTodo() {
  editingTodo.value = null
}
</script>

<style scoped></style>
