<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-in'],
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
    <h1>You are logged in!</h1>
    <p>
      Only logged in users can see this page<pre>definePageMeta({
  middleware: ['hanko-logged-in'],
})</pre>
    </p>
    <button @click="logout">
      Log me out
    </button>
    <button @click="tryAuthenticatedRequest">
      Try an auth request
    </button>
    <pre>{{ result }}</pre>
  </main>
</template>
