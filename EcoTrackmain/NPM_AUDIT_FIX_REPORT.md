# WasteWise Dependency Notes

Dependencies were refreshed after the MERN conversion.

## Current Packages

- `client/package-lock.json` was regenerated after adding Tailwind CSS, Lucide React, Recharts, and Framer Motion.
- `server/package-lock.json` was refreshed for the Express API package rename.

## Audit Status

After installation, npm reported audit findings in both dependency trees. Review before production deployment:

```bash
cd client
npm audit

cd ../server
npm audit
```

Use `npm audit fix` carefully and retest `npm run build` for the client afterward.
