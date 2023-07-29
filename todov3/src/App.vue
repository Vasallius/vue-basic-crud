<template>
  <div v-if="isAuthenticated">
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
    <div>TEST</div>
    <div>{{ data }}</div>
    <button @click="logoutuser">LOG OUT</button>
  </div>
  <div v-else>
    <button @click="login">LOGIN</button>
  </div>
  <div>
    {{ user }}
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { ref } from 'vue'
// const { loginWithRedirect } = useAuth0()
const { loginWithPopup, user, isAuthenticated, logout } = useAuth0()

const login = () => {
  loginWithPopup()
}

const logoutuser = () => {
  logout()
}
// const data = ref('lol')
// const fetchData = async () => {
//   const response = await fetch('http://localhost:3000/')
//   data.value = await response.json()
//   console.log(data.value)
// }
// onMounted(fetchData)

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
