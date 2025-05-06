<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-allow-all'],
})
</script>

<template>
  <main>
    <h1>About</h1>
    <p>
      This page is accesible to both logged in and logged out users. No middleware is defined for
      this page.
    </p>
  </main>
</template>
