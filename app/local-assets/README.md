# Captured binary assets

These 104 files are byte-for-byte copies of the captured images, audio and font
declared by the authored application's `/local-assets/` references. Their source
URLs and local capture paths come from
`projects/ys.mihoyo.com/url_mapping.json`. No captured HTML, CSS, JSON or
application JavaScript is included here.

| Format | Files | Bytes |
| --- | ---: | ---: |
| PNG | 95 | 8,541,110 |
| JPEG | 1 | 16,428 |
| MP3 | 7 | 1,880,371 |
| WOFF2 | 1 | 186,736 |
| Total | 104 | 10,624,645 |

To regenerate from the original local capture, run from the repository root:

```sh
node tools/pack-assets.cjs
```

The offline packer scans runtime HTML, CSS, modules, JSON and GLSL, resolves exact
references through the captured manifest, and rejects unknown or executable
resources before copying anything. Duplicate references are packed once. Files
whose bytes already match are left untouched; unrelated files are not deleted.
Verification scripts, extraction provenance, documentation and this output
directory are excluded from the scan.

The committed binary files make a static export independent of the ignored
`projects/` capture. Regenerating these files still requires that original local
capture; running the exported page does not.
