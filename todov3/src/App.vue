<template>
  {{ user }}
  <div v-if="isAuthenticated">
    <p>What would you like to do today, {{ user.name }} ?</p>
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
    <div>{{ data }}</div>
    <button @click="logoutuser">LOG OUT</button>
  </div>
  <div v-else>
    <button @click="login">LOGIN</button>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { ref } from 'vue'

const todo = ref('')
const todos = ref([])
const editingTodo = ref(null)

const { loginWithPopup, user, isAuthenticated, logout } = useAuth0()

const login = async () => {
  await loginWithPopup()
  if (isAuthenticated) {
    const response = await fetch(`http://localhost:3000/${user.value.email}`)
    const data = await response.json()
    console.log(data.data)
    todos.value = data.data.todos
  }
}

const logoutuser = () => {
  logout()
}

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
