<script>
	import {Editor} from 'typewriter-editor';
	import Toolbar from 'typewriter-editor/lib/Toolbar.svelte';
	import asRoot from 'typewriter-editor/lib/asRoot';

	const editor = new Editor();		
</script>
	<main>
		<Toolbar {editor} let:active let:commands>
			<div class="toolbar">
				<button
					class="toolbar-button material-icons"
					class:active={active.header === 2}
					on:click={commands.header2}>title</button>
			
				<button
					class="toolbar-button material-icons header3"
					class:active={active.header === 3}
					on:click={commands.header3}>title</button>
			
				<button
					class="toolbar-button material-icons"
					class:active={active.bold}
					on:click={commands.bold}>format_bold</button>
			
				<button
					class="toolbar-button material-icons"
					class:active={active.italic}
					on:click={commands.italic}>format_italic</button>
			
				<button
					class="toolbar-button material-icons"
					disabled={!active.undo}
					on:click={commands.undo}>undo</button>
			
				<button
					class="toolbar-button material-icons"
					disabled={!active.redo}
					on:click={commands.redo}>redo</button>
			</div>
		</Toolbar>
		<div use:asRoot={editor} class='text-content'>
			<h1>Daglig notat</h1>
		</div>
	</main>
	<style>
		.text-content {
			outline: none;
			padding: 8px 16px;
			border-radius: 3px;
			min-height: 256px;
			overflow-y: auto;
			border: 1px solid #ced4da;
			transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
		}
		@media (min-width: 640px) {
			main {
				max-width: none;
			}
		}
		.toolbar {
			display: flex;
			background: #eee;
			padding: 8px;
			margin-bottom: 8px;
			border-radius: 3px;
			box-shadow: 0 1px 2px rgba(0, 0, 0, .3), 0 2px 6px rgba(0, 0, 0, .1);
		}
		.toolbar-button {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fff;
			margin: 0;
			width: 40px;
			height: 40px;
			margin-right: 4px;
			border-radius: 4px;
			border: 1px solid #ced4da;
			transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
			cursor: pointer;
		}
		.toolbar-button:hover {
			outline: none;
			border-color: #80bdff;
			box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
		}
		.toolbar-button.active {
			border-color: #80bdff;
			background: #eaf4ff;
		}
		.header3 {
			font-size: 18px;
		}
	</style>

<!-- <style>
	.text-content {
		outline: none;
		padding: 8px 16px;
		border-radius: 3px;
		min-height: 256px;
		overflow-y: auto;
		border: 1px solid #ced4da;
		transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
	}
	.text-content.focus {
		border-color: #80bdff;
		box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
	}
	.text-content pre {
		background: #f3f3f3;
		border-radius: 6px;
		padding: 8px 12px;
		line-height: 1.6;
		color: #000;
	}
</style> -->


