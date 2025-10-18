<script lang="ts">
	export let onNavigate: (screen: string) => void;
</script>

<main>
  <p>Settings Screen</p>
  <button on:click={() => onNavigate("HomeScreen")}>Home</button>
</main>

<style>
  /*  */
</style>