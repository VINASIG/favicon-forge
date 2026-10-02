# Security reporting

Report exposed credentials, unintended uploads, unsafe image processing or other sensitive findings through [GitHub private vulnerability reporting](https://github.com/VINASIG/favicon-forge/security/advisories/new).

Include the affected commit, relative path, local reproduction steps and impact. Use a synthetic image fixture. Omit plaintext credentials, personal logos, cookies and account captures from public issues and reports.

The application accepts PNG, JPG, WebP and SVG files up to 10 MB. It checks decoded dimensions before allocating a source canvas and limits rasterization to 16 million pixels. Browser-native image decoding still has resource costs; these limits are safeguards, not a guarantee against every malformed image or browser defect.

Local tests verify that fixture processing makes no remote requests or uploads. Dependencies are audited separately. Screen-reader testing, field performance and an independent SI-agent trial require their own evidence.
