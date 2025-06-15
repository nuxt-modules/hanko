<script setup lang="ts">
definePageMeta({
  hanko: {
    deny: 'logged-out',
  },
})
</script>

<template>
  <main>
    <h1>GlobalMiddleware: deny loggedOut</h1>
    <p>
      This page is not accessible to loggedOut users <pre>definePageMeta({
  hanko: {
    deny: 'logged-out',
  }
})</pre>
    </p>
  </main>
</template>
