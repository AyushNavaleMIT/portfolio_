# Ayush Navale — Developer Portfolio

A static, dark neon portfolio for Ayush Amol Navale (B.Tech IT, AI Track, MIT Academy of Engineering, Pune).
Built with plain HTML5, CSS3 and vanilla JavaScript. No framework, no build step, no backend.

## Technologies
- HTML5 (semantic landmarks, skip link, ARIA for menu and accordion)
- CSS3 (custom properties, grid, clip-path card shapes, keyframes)
- Vanilla JavaScript ES6+ (IntersectionObserver reveals, GitHub public API with fallback)
- Google Fonts: Barlow Condensed + Space Grotesk (system fallbacks included)
- Third-party at runtime: GitHub REST API (public data) and `ghchart.rshah.org` (contribution graph image). Both fail gracefully.

GSAP, Lenis and Lucide were deliberately not used: the same motion is done with CSS + IntersectionObserver, and icons are inline SVG.

## Folder structure
```
ayush-portfolio/
├── index.html
├── README.md
├── .gitignore
├── css/   style.css · animations.css · responsive.css
├── js/    main.js · animations.js · interactions.js
└── assets/
    ├── images/         ayush.jpg (original) · ayush-480.jpg · ayush-875.jpg (web versions)
    ├── certificates/   8 certificate PDFs + thumbs/ (preview images)
    ├── documents/      datathon.pdf
    ├── projects/       campus-compass.html (working demo)
    └── icons/ videos/ fonts/
```

## Content migrated from the earlier portfolio
Content came from `AyushNavaleMIT/portfolio` (read only, nothing in that repo was changed).
- Photo, 8 certificate PDFs and the Datathon PDF are byte-identical copies. The two Python Essentials files were renamed because their original filenames contained an email address.
- `thumbs/` and `ayush-480/875.jpg` are derived preview images; the PDFs themselves are untouched.
- `assets/projects/campus-compass.html` is the old Campus Compass page; only its "Home" link was changed to point back here.
- Deliberately not migrated: the old contact form (it never sent anything), phone number, "Oracle/NASSCOM certified" claims (no certificate on file), "60+ hours" and the year-of-study text, which was out of date.

## Adding your real links
Open `js/main.js` and fill in the `CONFIG` object at the top: `email`, `linkedin`, each project's `github`, `demo` and `stack`, and certificate verification URLs.
Empty values stay as visibly labelled "coming soon" slots; filled values automatically become working links.
Replace the "Date to be added" entries in the timeline (`index.html`, section `#journey`) once you have accurate dates.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploy with GitHub Pages
1. Create a repository named `ayush-portfolio` and push these files to the repository root.
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. The site will be live at `https://<your-username>.github.io/ayush-portfolio/` after a minute or two.

All asset paths are relative, so it works under the sub-path.

## Placeholders still to fill
LinkedIn, repository/demo links for Campus Club Hub, NetPulse, NetSage AI and HypoGuard AI, their tech stacks, documents for the Cisco AICTE internship and JavaScript Essentials, the JavaScript Essentials date, and an Open Graph preview image.
