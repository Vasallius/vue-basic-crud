<template>
  <div v-if="isAuthenticated">
    <p>What would you like to do today, {{ user.name }}?</p>
    <div>
      <input type="text" name="addTodo" v-model="todo" placeholder="add new todo.." />
      <button @click="addNewTodo">Add</button>
    </div>
    <div v-for="todoItem in todos" :key="todoItem.id">
      <button @click="editTodoItem(todoItem)">Edit</button>
      <button @click="removeTodoItem(todoItem.id)">Clear Todo</button>
      <input v-if="editingTodo === todoItem.id" type="text" v-model="todoItem.text" />
      <span v-else>{{ todoItem.text }}</span>
      <button v-if="editingTodo === todoItem.id" @click="updateTodoItem">Save</button>
    </div>
    <button @click="logoutUser">LOG OUT</button>
  </div>
  <div v-else>
    <button @click="login">LOGIN</button>
  </div>
</template>
<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { ref } from 'vue'

const API_BASE_URL = 'http://localhost:3000'

const todo = ref('')
const todos = ref([])
const editingTodo = ref(null)

const { loginWithPopup, user, isAuthenticated, logout } = useAuth0()

const login = async () => {
  try {
    await loginWithPopup()
    if (isAuthenticated) {
      const response = await fetch(`${API_BASE_URL}/${user.value.email}`)
      const data = await response.json()
      console.log(data.data)
      todos.value = data.data.todos
    }
  } catch (error) {
    console.error('Error during login:', error)
  }
}

const logoutUser = () => {
  logout()
}

const removeTodoItem = async (id) => {
  try {
    // Remove from local state
    todos.value = todos.value.filter((todo) => todo.id !== id)

    // Sync with server
    const response = await fetch(`${API_BASE_URL}/deleteTodo`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        email: user.value.email // pass the actual user email here
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (data.message === 'Todo removed successfully!') {
      console.log('Todo deleted from server.')
    } else {
      console.error('Failed to delete todo from server: ', data.message)
    }
  } catch (error) {
    console.error('Error while removing todo:', error)
  }
}

const addNewTodo = async () => {
  try {
    if (todo.value.length === 0) {
      return
    }
    const response = await fetch(`${API_BASE_URL}/addTodo`, {
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
  } catch (error) {
    console.error('Error while adding todo:', error)
  }
}

const editTodoItem = (todoItem) => {
  editingTodo.value = todoItem.id
}

const updateTodoItem = async () => {
  try {
    const updatedTodo = todos.value.find((todo) => todo.id === editingTodo.value)
    if (!updatedTodo) return

    // Save local changes by resetting "editingTodo" state
    editingTodo.value = null

    // Sync with the server
    const response = await fetch(`${API_BASE_URL}/editTodo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: updatedTodo.id,
        text: updatedTodo.text,
        email: user.value.email
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (data.message === 'Todo updated successfully!') {
      console.log('Todo updated on server.')
    } else {
      console.error('Failed to update todo on server: ', data.message)
    }
  } catch (error) {
    console.error('Error while updating todo:', error)
  }
}
</script>
