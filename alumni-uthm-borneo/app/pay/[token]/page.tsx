import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/app/components/SiteFooter';
import { SiteHeader } from '@/app/components/SiteHeader';
import { Check, Clock, Cross } from '@/app/components/icons';
import { site } from '@/content/site';
import { findByToken } from '@/lib/db';
import { receiptPath } from '@/lib/payments';
import { displayName, formatRM2 } from '@/lib/rules';
import { CopyButton } from '../CopyButton';
import { ProofUpload } from '../ProofUpload';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Complete your payment · Alumni UTHM Borneo', robots: { index: false } };

const p = site.payment;

export default async function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const row = await findByToken(token);
  if (!row) notFound();

  const amount = formatRM2(row.amount);
  const status = row.payment_status;
  const needsPayment = status === 'PENDING' || status === 'REJECTED';

  return (
    <>
      <SiteHeader variant="solid" />
      <main id="main" className="status-page">
        <div className="wrap">
          <div className="status-card pay-card">
            {status === 'PAID' && (
              <>
                <div className="status-icon ok">
                  <Check />
                </div>
                <h1>Payment Verified</h1>
                <p className="lede">Thank you for supporting Alumni UTHM Borneo.</p>
              </>
            )}
            {status === 'AWAITING_VERIFICATION' && (
              <>
                <div className="status-icon wait">
                  <Clock />
                </div>
                <h1>Proof received, verification in progress</h1>
                <p className="lede">
                  {p.accountShortName} will check your payment against its bank records. Your receipt is emailed to{' '}
                  <strong>{row.email}</strong> once it is verified. You can close this page.
                </p>
              </>
            )}
            {status === 'PENDING' && (
              <>
                <h1>Complete your payment</h1>
                <p className="lede">
                  Pay <strong>{amount}</strong> to {p.accountShortName} by DuitNow QR or bank transfer, then upload your
                  proof of payment below.
                </p>
              </>
            )}
            {status === 'REJECTED' && (
              <>
                <div className="status-icon bad">
                  <Cross />
                </div>
                <h1>We could not verify your payment yet</h1>
                <p className="lede">
                  {row.rejection_reason ? <>Reason: {row.rejection_reason}. </> : null}
                  If you have paid, please upload a clearer proof below. If not, complete the payment first.
                </p>
              </>
            )}
            {status === 'FAILED' && (
              <>
                <div className="status-icon bad">
                  <Cross />
                </div>
                <h1>Payment not completed</h1>
                <p className="lede">This payment was not completed and no receipt has been issued.</p>
              </>
            )}

            <dl className="details">
              <div>
                <dt>Contribution ID</dt>
                <dd>{row.contribution_id}</dd>
              </div>
              <div>
                <dt>Name / Organisation</dt>
                <dd>{displayName(row)}</dd>
              </div>
              <div>
                <dt>Purpose</dt>
                <dd>{row.purpose}</dd>
              </div>
              {row.remark && (
                <div>
                  <dt>Remark</dt>
                  <dd>{row.remark}</dd>
                </div>
              )}
              <div className="amount">
                <dt>Amount</dt>
                <dd>{amount}</dd>
              </div>
              {status === 'PAID' && row.payment_reference && (
                <div>
                  <dt>Payment Reference</dt>
                  <dd>{row.payment_reference}</dd>
                </div>
              )}
              <div>
                <dt>Status</dt>
                <dd>
                  {status === 'PAID' && <span className="badge badge-paid">VERIFIED</span>}
                  {status === 'AWAITING_VERIFICATION' && <span className="badge badge-pending">AWAITING VERIFICATION</span>}
                  {status === 'PENDING' && <span className="badge badge-pending">AWAITING PAYMENT</span>}
                  {(status === 'REJECTED' || status === 'FAILED') && <span className="badge badge-failed">NOT VERIFIED</span>}
                </dd>
              </div>
            </dl>

            {needsPayment && (
              <ol className="pay-steps">
                <li className="pay-step">
                  <h2>Pay {amount}</h2>
                  <div className="pay-methods-grid">
                    <figure className="qr-box">
                      <Image src={p.qrImage} alt={`DuitNow QR code for ${p.accountName}`} width={240} height={240} unoptimized />
                      <figcaption>
                        <span className="qr-label">DuitNow QR · {p.accountShortName}</span>
                        <a href={p.qrImage} download="KOBIS-DuitNow-QR.png">
                          Save QR image
                        </a>
                      </figcaption>
                    </figure>
                    <div className="bank-box">
                      <p className="bank-intro">Or transfer to:</p>
                      <dl className="bank-details">
                        <div>
                          <dt>Account name</dt>
                          <dd>{p.accountName}</dd>
                        </div>
                        <div>
                          <dt>Account number</dt>
                          <dd className="copy-row">
                            <span className="mono">{p.accountNumber}</span>
                            <CopyButton value={p.accountNumber} label="account number" />
                          </dd>
                        </div>
                        <div>
                          <dt>Bank</dt>
                          <dd>{p.bank}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className="pay-notes">
                    <p>
                      Enter exactly <strong>{amount}</strong> in your banking or e-wallet app.
                    </p>
                    <p className="copy-row">
                      <span>
                        Recipient reference: <strong className="mono">{row.contribution_id}</strong>
                      </span>
                      <CopyButton value={row.contribution_id} label="reference" />
                    </p>
                    <p className="hint">
                      On a phone, save the QR image, then open your banking app and scan it from your gallery.
                    </p>
                  </div>
                </li>
                <li className="pay-step">
                  <h2>Upload proof of payment</h2>
                  <p className="pay-step-sub">
                    A screenshot of the successful transfer showing the amount, date and reference.
                  </p>
                  <ProofUpload token={token} replacing={status === 'REJECTED'} />
                </li>
              </ol>
            )}

            {status === 'AWAITING_VERIFICATION' && (
              <details className="replace-proof">
                <summary>Uploaded the wrong file? Replace it</summary>
                <ProofUpload token={token} replacing />
              </details>
            )}

            {status === 'PAID' && (
              <p className="status-note">
                Your payment acknowledgement / receipt is sent to your registered email address ({row.email}). You can
                also download it below.
              </p>
            )}

            <div className="status-actions">
              {status === 'PAID' && (
                <a className="btn btn-primary" href={receiptPath(row)} download>
                  Download Receipt
                </a>
              )}
              <Link className="btn btn-outline" href="/">
                Return Home
              </Link>
            </div>

            {needsPayment && (
              <p className="pay-footnote">
                Payments are received by {p.accountName} ({p.accountShortName}) under the Chapter&rsquo;s interim
                administrative arrangement. Keep this page&rsquo;s link to come back later.{' '}
                <a href={p.poster} download="KOBIS-Payment-Information.webp">
                  Download payment poster
                </a>
              </p>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
