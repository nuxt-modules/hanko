<script setup lang="ts">
definePageMeta({
  hanko: {
    allow: 'all',
  },
})
</script>

<template>
  <main>
    <h1>GlobalMiddleware: allow all</h1>
    <div>
      This page is accessible for both logged in and logged out users.
      <pre>
definePageMeta({
  hanko: {
    allow: 'all',
  }
})</pre>
    </div>
  </main>
</template>
