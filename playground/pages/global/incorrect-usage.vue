<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-in'],
  hanko: { allow: 'all' },
})
</script>

<template>
  <main>
    <h1>Don't combine pageMeta:hanko and hanko-middleware</h1>
    <p>In case you do, the middleware takes precedence.</p>
  </main>
</template>
