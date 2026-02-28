<script setup lang="ts">
definePageMeta({
  hanko: {
    deny: 'logged-in',
  },
})
</script>

<template>
  <main>
    <h1>GlobalMiddleware: deny loggedIn</h1>
    <p>
      This page is not accessible to loggedIn users <pre>definePageMeta({
  hanko: {
    deny: 'logged-in',
  }
})</pre>
    </p>
  </main>
</template>
