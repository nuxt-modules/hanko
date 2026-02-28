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
    <p>
      This page is accessible for both logged in and logged out users. <pre>definePageMeta({
  hanko: {
    allow: 'all',
  }
})</pre>
    </p>
  </main>
</template>
