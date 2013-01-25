jquery.easy-sticky-stack.js
===========================

Manages sticky stacking headings on scroll

The API
-------

This script enables elements to follow the user as they scroll vertically. Each susequent sticky item replaces the one before it when it hits the top of the viewport.

This behavior is automated using HTML5 `data-*` attributes:

		<h1 data-easy-sticky-stack>Title</h1>
		…
		<h1 data-easy-sticky-stack>Another Title</h1>
		…
		<h1 data-easy-sticky-stack>Yet Another Title</h1>

To set a threshold for the sticky stack to be enabled, use the `data-easy-sticky-stack-threshold` attribute with a valid CSS value Note: You only need to set the threshold on the first sticky stack item.

		<h1 data-easy-sticky-stack
			data-easy-sticky-stack="40em">Title</h1>
		…
		<h1 data-easy-sticky-stack>Another Title</h1>
		…
		<h1 data-easy-sticky-stack>Yet Another Title</h1>