#!/bin/bash
sed -i -e 1,4d soundfont/*-ogg.js
sed -i -e '1i\'"{" soundfont/*-ogg.js
sed -i -e '/^$/d' soundfont/*-ogg.js
sed -i -e 'N; $! { P; D; }; s/,\n/\n/' soundfont/*-ogg.js
rename 's/\.js$/.json/' soundfont/*-ogg.js
