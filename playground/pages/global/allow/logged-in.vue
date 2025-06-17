<script setup lang="ts">
definePageMeta({ hanko: { allow: 'logged-in' } })
</script>

<template>
  <main>
    <h1>GlobalMiddleware: allow loggedIn</h1>
    <p>
      Only logged in users can see this page <pre>definePageMeta({
  hanko: {
    allow: 'logged-in',
  }
})</pre>
    </p>
  </main>
</template>
