
<template>
  <main>
    <h1>Log in</h1>
    <hanko-auth />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-out']
})
</script>
