<template>
  <div class="card border-secondary mb-3" style="max-width: 28rem;">
    <div class="card-header" :id="'email'+card.id">{{ card.email }}</div>
    <div class="card-body text-secondary">
      <h5 class="card-title" :id="'message'+card.id">{{ card.message }}</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    card: Object,
  },
}
</script>

<style scoped>

</style>
