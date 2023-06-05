<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-in']
})

const hanko = useHanko()
function logout() {
  hanko!.user.logout()
}

const result = ref()

async function tryAuthenticatedRequest() {
  result.value = null
  result.value = await $fetch('/api/test')
}
</script>

<template>
  <main>
    <h1>
      Logged in!
    </h1>
    <button @click="logout">
      Log me out
    </button>
    <button @click="tryAuthenticatedRequest">
      Try auth request
    </button>
    <pre>{{ result }}</pre>
  </main>
</template>
