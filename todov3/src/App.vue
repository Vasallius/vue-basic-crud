<template>
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
  // Remove from local state
  todos.value = todos.value.filter((todo) => todo.id !== id)

  // Sync with server
  fetch('http://localhost:3000/deleteTodo', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id,
      email: user.value.email // pass the actual user email here
    })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Todo removed successfully!') {
        console.log('Todo deleted from server.')
      } else {
        console.error('Failed to delete todo from server: ', data.message)
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

async function addTodo() {
  if (todo.value.length === 0) {
    return
  }
  const response = await fetch('http://localhost:3000/addTodo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ todo: todo.value, email: user.value.email })
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  todos.value = data.data.todos

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
