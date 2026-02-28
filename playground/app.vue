<script setup lang="ts">
const nuxtConfig = useAppConfig()
const isGlobalMiddleware = computed(() => nuxtConfig.hanko.globalMiddleware)
</script>

<template>
  <nav v-if="!isGlobalMiddleware">
    <NuxtLink to="/">
      Go home
    </NuxtLink>
    <NuxtLink to="/login">
      Log in page ⛔️👤
    </NuxtLink>
    <NuxtLink to="/user">
      User Page 🔐
    </NuxtLink>
    <NuxtLink to="/protected">
      Protected page 🔐
    </NuxtLink>
    <NuxtLink to="/about">
      About page
    </NuxtLink>
  </nav>
  <nav v-else>
    <NuxtLink
      id="allow-all"
      to="/global/allow/all"
    >
      Allow all
    </NuxtLink>
    <NuxtLink
      id="allow-logged-in"
      to="/global/allow/logged-in"
    >
      Allow logged-in
    </NuxtLink>
    <NuxtLink
      id="allow-logged-out"
      to="/global/allow/logged-out"
    >
      Allow logged-out
    </NuxtLink>
    <NuxtLink
      id="deny-logged-in"
      to="/global/deny/logged-in"
    >
      Deny logged-in
    </NuxtLink>
    <NuxtLink
      id="deny-logged-out"
      to="/global/deny/logged-out"
    >
      Deny logged-out
    </NuxtLink>
    <NuxtLink
      id="incorrect-usage"
      to="/global/incorrect-usage"
    >
      Incorrect usage
    </NuxtLink>
  </nav>
  <NuxtPage />
</template>
