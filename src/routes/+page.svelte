<script lang="ts">
  import * as AlertDialog from "$lib/common/components/ui/alert-dialog/index.js";
  import { Button } from "$lib/common/components/ui/button/index.js";
 </script>
  
 <AlertDialog.Root>
  <AlertDialog.Trigger asChild let:builder>
   <Button builders={[builder]} variant="outline">Show Dialog</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
   <AlertDialog.Header>
    <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
    <AlertDialog.Description>
     This action cannot be undone. This will permanently delete your account
     and remove your data from our servers.
    </AlertDialog.Description>
   </AlertDialog.Header>
   <AlertDialog.Footer>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action>Continue</AlertDialog.Action>
   </AlertDialog.Footer>
  </AlertDialog.Content>
 </AlertDialog.Root>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<div class="h-full w-full">
  <video src="http://localhost:8080/streaming/video/javatechie" width="720px" height="480px" controls preload="auto">
    <track kind="captions">
  </video>
</div>
