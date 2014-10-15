hideshow
=========

**A simple and flexible show hide jQuery plugin**

Usage
-----
```
<p>Paragraph...</p>
<div data-hideshow>
	<p>Paragraph...</p>
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


Stuff
-----
```
<!-- Customize the show text/html of the toggle -->
<p>Paragraph...</p>
<div data-hideshow data-hideshow-show="Read more ;)">
	<p>Paragraph...</p>
</div>

<!-- Customize the hide text/html of the toggle -->
<p>Paragraph...</p>
<div data-hideshow data-hideshow-show="Read more ;)" data-hideshow-hide=":p">
	<p>Paragraph...</p>
</div>

<!-- Place a toggle wherever I want -->
<p>Paragraph...<a data-hideshow-for="mything" data-hideshow-show="Read more ;)" data-hideshow-hide=":p"></a></p>
<div data-hideshow="mything">
	<p>Paragraph...</p>
</div>

<!-- Have separate show and hide toggles -->
<p>Paragraph...<a data-hideshow-for="mything" data-hideshow-show="Read more ;)"></a></p>
<div data-hideshow="mything">
	<p>Paragraph...</p>
	<p><a data-hideshow-for="mything" data-hideshow-hide=":p"></a></p>
</div>

```

Advanced
--------
```
<!-- Toggle wrap customization -->
<!-- Here the default <p></p> that wraps the generated toggle is removed -->
<p>Paragraph...</p>
<div data-hideshow data-hideshow-show="Read more ;)" data-hideshow-hide=":p" data-hideshow-toggle-wrap>
	<p>Paragraph...</p>
</div>

// Use custom show and hide text/html defaults for toggles
// The data attributes will trump these defaults
$(function() {
	$('[data-hideshow]').hideshow({show:'More...',hide:'Less...'});
});

// Recalculate panel max-heights
$(function() {
	$('[data-hideshow]').hideshow('resized');
});
```

Created 2014 October 10
