# Recurrent Sinusoidal INRs for Efficient High-Fidelity Representation — Project Page

Static project page for the ECCV 2026 paper
**"Recurrent Sinusoidal INRs for Efficient High-Fidelity Representation: Harmonic-line Spectrum Perspective"**
(Hyunmin Cho, Jaejun Yoo, Kyong Hwan Jin).

A recurrent, weight-tied sinusoidal INR iteratively refines a latent state under a **fixed parameter budget**.
The page is built around the **recurrence-as-spectral-enrichment** story: a harmonic line-spectrum view
(Jacobi–Anger) shows that each shared sinusoidal step adds spectral lines at integer combinations of existing
frequencies, so recurrent unrolling enriches effective spectral support without adding parameters.

Section flow: motivation → harmonic line-spectrum (theory) → **direct spectral-support measurement** validating
it (sinusoidal recurrence grows support 30.9% → 94.6%, while contractive iterative-SIREN saturates and
non-sinusoidal recurrence collapses) → method → fidelity vs. number of recurrent steps. Bipolar (Gray-coded)
code-space supervision appears as an optional add-on for exact quantized reconstruction.

## Structure

```
project_page/
├── index.html                      # self-contained page (Bulma + MathJax)
├── .nojekyll                       # disable Jekyll on GitHub Pages
└── static/
    ├── css/                        # bulma, fontawesome, academicons, inter, index.css
    ├── js/                         # jquery, fontawesome, index.js
    ├── fonts/  webfonts/           # icon + Inter fonts
    └── images/                     # pipeline.png (method figure)
```

## Viewing locally

It is a single static page with no build step. Either open `index.html` directly, or serve the folder:

```bash
cd project_page
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to GitHub Pages

Push the contents of this folder to a `gh-pages` branch (or a `/docs` folder on `main`).
The `.nojekyll` file ensures the `static/` assets are served as-is.

## Credits

Built on the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template),
adapted from [Nerfies](https://nerfies.github.io). Licensed under
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/).
