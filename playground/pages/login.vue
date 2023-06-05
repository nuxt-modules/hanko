
<template>
  <hanko-auth />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-out']
})
</script>
