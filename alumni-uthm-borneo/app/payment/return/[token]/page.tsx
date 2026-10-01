import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/app/components/SiteFooter';
import { SiteHeader } from '@/app/components/SiteHeader';
import { Check, Clock, Cross } from '@/app/components/icons';
import { findByToken, type ContributionRow } from '@/lib/db';
import { receiptPath, verifyContribution } from '@/lib/payments';
import { displayName, formatRM2 } from '@/lib/rules';
import { AutoRefresh } from '../AutoRefresh';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Payment status · Alumni UTHM Borneo', robots: { index: false } };

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaymentReturn({ params, searchParams }: Props) {
  const { token } = await params;
  const query = await searchParams;
  const found = await findByToken(token);
  if (!found) notFound();

  // Always confirm with ToyyibPay; the query string is only a hint for wording.
  let row: ContributionRow = found;
  let checkFailed = false;
  try {
    row = await verifyContribution(found);
  } catch (err) {
    console.error('[return] verify failed', found.contribution_id, err);
    checkFailed = true;
  }

  const cancelledHint = query.status_id === '3';
  const state = row.payment_status === 'PAID' ? 'paid' : row.payment_status === 'FAILED' || cancelledHint ? 'failed' : 'pending';
  const retryUrl = row.toyyibpay_bill_code
    ? `${(process.env.TOYYIBPAY_BASE_URL || 'https://dev.toyyibpay.com').replace(/\/+$/, '')}/${row.toyyibpay_bill_code}`
    : null;

  return (
    <>
      <SiteHeader variant="solid" />
      <main id="main" className="status-page">
        <div className="wrap">
          <div className="status-card">
            {state === 'paid' && (
              <>
                <div className="status-icon ok">
                  <Check />
                </div>
                <h1>Payment Successfully Received</h1>
                <p className="lede">Thank you for supporting Alumni UTHM Borneo.</p>
              </>
            )}
            {state === 'pending' && (
              <>
                <div className="status-icon wait">
                  <Clock />
                </div>
                <h1>Confirming your payment</h1>
                <p className="lede">
                  We are waiting for ToyyibPay to confirm this transaction. This page updates by itself. Please do not pay
                  again.
                </p>
              </>
            )}
            {state === 'failed' && (
              <>
                <div className="status-icon bad">
                  <Cross />
                </div>
                <h1>Payment not completed</h1>
                <p className="lede">
                  The payment was cancelled or not approved, so no amount has been recorded and no receipt has been
                  issued. You can try again below.
                </p>
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
                <dd>{formatRM2(row.amount)}</dd>
              </div>
              {state === 'paid' && (
                <div>
                  <dt>Transaction Reference</dt>
                  <dd>{row.toyyibpay_transaction_id || '-'}</dd>
                </div>
              )}
              <div>
                <dt>Payment Status</dt>
                <dd>
                  {state === 'paid' && <span className="badge badge-paid">PAID</span>}
                  {state === 'pending' && <span className="badge badge-pending">AWAITING CONFIRMATION</span>}
                  {state === 'failed' && <span className="badge badge-failed">NOT PAID</span>}
                </dd>
              </div>
            </dl>

            {state === 'paid' && (
              <p className="status-note">
                Your payment acknowledgement / receipt has been sent automatically to your registered email address
                {row.email ? ` (${row.email})` : ''}.
              </p>
            )}
            {state === 'pending' && checkFailed && (
              <p className="status-note">We could not reach ToyyibPay just now. Retrying automatically.</p>
            )}
            {state === 'pending' && <AutoRefresh />}

            <div className="status-actions">
              {state === 'paid' && (
                <a className="btn btn-primary" href={receiptPath(row)} download>
                  Download Receipt
                </a>
              )}
              {state === 'failed' && retryUrl && (
                <a className="btn btn-primary" href={retryUrl}>
                  Try Payment Again
                </a>
              )}
              <Link className="btn btn-outline" href="/">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
