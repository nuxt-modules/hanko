<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-out']
})
const redirectPath = ref<string | null>(null)
redirectPath.value = useRoute().query.redirect as string | null
</script>

<template>
  <main>
    <h1>Log in</h1>
    <p>
      Only logged out users can see this page<pre>definePageMeta({
  middleware: ['hanko-logged-out'],
})</pre>
    </p>
    <p v-if="$route.query.redirect">
      You were redirected here from {{ $route.query.redirect }}, once you login, you'll be sent back automatically!
    </p>
    <hanko-auth />
  </main>
</template>

