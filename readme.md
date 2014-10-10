hideshow
=========

**A simple and flexible show hide plugin**


Usage
-----
```
<p>Para 1</p>
<div data-hideshow="thing">
	<p>Para 2</p>
</div>
```
Add jQuery, hideshow.js and do the business, for example:
```
<script src="pathto/jquery.js"></script>
<script src="pathto/hideshow.js"></script>
<script>
$(function() {
    $('[data-hideshow]').hideshow();
});
</script>
```


More interesting stuff
-----
```
<p>Para 1
	<span data-hideshow-for="thing" data-hideshow-hide="<em>Show less</em>" data-hideshow-show="<strong>Read more</strong>"></span>
</p>
<div data-hideshow="thing">
	<p>Para 2</p>
</div>
```


Created 2014 October 10
