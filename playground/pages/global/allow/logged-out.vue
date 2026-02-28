<script setup lang="ts">
definePageMeta({ hanko: { allow: 'logged-out' } })
</script>

<template>
  <main>
    <h1>GlobalMiddleware: allow loggedOut</h1>
    <div>
      Only logged out users can see this page
      <pre>
definePageMeta({
  hanko: {
    allow: 'logged-out',
  }
})</pre>
    </div>
  </main>
</template>
