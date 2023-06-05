<script setup lang="ts">
definePageMeta({
  middleware: ['hanko-logged-in']
})

const hanko = useHanko()
function logout() {
  hanko.user.logout()
}

function tryAuthenticatedRequest() {
  $fetch('/api/test')
}

</script>

<template>
  <div>
    Logged in!
    <button @click="logout">
      Log me out
    </button>
    <button @click="tryAuthenticatedRequest">
      Try auth request
    </button>
  </div>
</template>
