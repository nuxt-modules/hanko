<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-in'],
})
const hanko = useHanko()
function logout() {
  hanko!.user.logout()
}
</script>
<template>
  <div>
    <h1>Protected Page</h1>
    <p>
      Only logged in users can see this page<pre>definePageMeta({
  middleware: ['hanko-logged-in'],
})</pre>
    </p>
    <button @click="logout">
      Log me out
    </button>
  </div>
</template>
