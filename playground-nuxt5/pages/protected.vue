<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-in'],
})

const result = ref()

async function tryAuthenticatedRequest() {
  result.value = await $fetch('/api/test')
}
</script>

<template>
  <main>
    <h1>Protected Page</h1>
    <button @click="tryAuthenticatedRequest">
      Try an auth request
    </button>
    <pre>{{ result }}</pre>
  </main>
</template>
