'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';

/** Large phone photos are re-encoded in the browser so they fit the 4MB limit. */
async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.size <= 3.5 * 1024 * 1024) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
  return blob ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
}

export function ProofUpload({ token, replacing = false }: { token: string; replacing?: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function choose(f: File | undefined) {
    setError('');
    if (!f) return setFile(null);
    if (!ACCEPT.split(',').includes(f.type) && f.type !== '') {
      setFile(null);
      return setError('Please choose a JPG, PNG or WEBP screenshot, or a PDF.');
    }
    setFile(f);
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError('Choose your payment screenshot or PDF first.');
    setBusy(true);
    setError('');
    try {
      const ready = await shrinkImage(file);
      if (ready.size > MAX_BYTES) {
        setBusy(false);
        return setError('The file is too large. Please upload a file under 4MB.');
      }
      const body = new FormData();
      body.append('proof', ready);
      const res = await fetch(`/api/proof/${token}`, { method: 'POST', body });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Upload failed. Please try again.');
      router.refresh();
    } catch (err) {
      setError((err as Error).message || 'Upload failed. Please try again.');
      setBusy(false);
    }
  }

  return (
    <form className="proof-form" onSubmit={upload} noValidate>
      <label className={`dropzone${file ? ' has-file' : ''}`}>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={(e) => choose(e.target.files?.[0])}
          aria-describedby="proof-hint"
        />
        <span className="dropzone-title">{file ? file.name : replacing ? 'Choose a new file' : 'Choose screenshot or PDF'}</span>
        <span className="dropzone-sub" id="proof-hint">
          {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB · tap to change` : 'JPG, PNG, WEBP or PDF, up to 4MB'}
        </span>
      </label>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
        {busy ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Uploading…
          </>
        ) : replacing ? (
          'Upload New Proof'
        ) : (
          'Submit Proof of Payment'
        )}
      </button>
    </form>
  );
}
