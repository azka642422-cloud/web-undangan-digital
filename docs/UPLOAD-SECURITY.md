# AKSARA UNDANGAN — Media Upload Security Contract

This document is a production gate. Media upload must remain disabled until the deployed storage adapter satisfies this contract.

## Authorization and ownership

- Upload endpoints require an authenticated server session.
- Customers may upload only to invitations owned by their `user_id`; admins use a separately authorized path.
- Never accept a bucket name, filesystem path, object key, public URL, owner ID, or invitation owner from the browser as authoritative.
- The server generates opaque object keys and binds them to the authenticated invitation.

## Allowed media

Images:
- JPEG, PNG, or WebP only.
- Maximum 8 MiB per source image.
- Decode the bytes server-side and verify the actual format; do not trust filename extensions or `Content-Type` alone.
- Re-encode accepted images before publication to strip active/unexpected metadata and malformed polyglot content.
- Reject SVG, HTML, XML, PDF, executable formats, archives, and unknown formats.

Audio:
- Only enabled for packages that include music.
- Maximum 15 MiB.
- Validate the actual media container/codec server-side before storage/publication; do not trust extension or browser MIME type.
- Reject playlists, scripts, archives, and arbitrary binary files.

## Storage and serving

- Use a dedicated object-storage bucket/container; never write uploads into the application source tree or a web-server executable directory.
- Storage credentials are server-only and least-privilege. They must not be exposed through `VITE_*`, committed files, invitation payloads, or public API responses.
- New uploads are private/quarantined until validation succeeds.
- Public objects must be served as inert media with correct `Content-Type`, `X-Content-Type-Options: nosniff`, and a restrictive Content Security Policy at the application/edge.
- Generate unpredictable object keys; never reuse the original filename as a path.
- Prevent overwrite-by-key and cross-tenant reads/writes.
- Deleting/replacing media must verify invitation ownership server-side.

## Abuse and resource controls

- Apply authenticated per-user upload rate limits in addition to edge limits.
- Enforce package gallery limits server-side; frontend limits are only UX.
- Enforce request/body limits before buffering large payloads in application memory.
- Record upload metadata (owner, invitation, object key, validated media type, byte size, created time) in the database.
- Log rejected uploads without storing raw file contents in application logs.

## Publication lifecycle

1. Authenticated client requests an upload capability for an invitation it owns.
2. Server checks package entitlement, media category, quota, requested size/type, and ownership.
3. Upload goes to a private/quarantine location with a short expiry.
4. Trusted server/worker validates actual bytes and re-encodes images where applicable.
5. Only validated objects are promoted/marked publishable and referenced by invitation data.
6. Abandoned quarantine objects are removed automatically.

## Production gate

Until an object-storage provider is selected and this lifecycle is implemented end-to-end, the production API must not expose a generic file-upload endpoint. Do not add a temporary unrestricted `multer`, filesystem, base64-in-JSON, or client-direct public-bucket workaround.
