import type { Metadata } from 'next';
import { DocPage } from '../components/DocPage';
import { site } from '@/content/site';

export const metadata: Metadata = { title: `Privacy · ${site.brand}` };

export default function Privacy() {
  return (
    <DocPage title="Privacy" updated="1 October 2026">
      <p>
        This notice explains how the {site.brand} contribution portal handles the personal data you provide when making
        a contribution or payment.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Your name or organisation name, and a contact person for organisations</li>
        <li>Email address and mobile number</li>
        <li>Contribution type, purpose, amount and any remark you choose to add</li>
        <li>Payment references returned by ToyyibPay (we never receive or store card or online banking credentials)</li>
      </ul>
      <h2>Why we use it</h2>
      <ul>
        <li>To process and verify your payment through ToyyibPay</li>
        <li>To issue and email your payment / contribution acknowledgement</li>
        <li>To record contributions according to their stated purpose and keep accurate financial records</li>
        <li>To contact you about your contribution where necessary</li>
      </ul>
      <h2>Who can see it</h2>
      <p>
        Your data is accessible to authorised administrators of {site.formalName} and {site.facilitator}, which
        facilitates payments and administration under the current interim arrangement. Payment details are processed by
        ToyyibPay and your bank or card provider under their own terms. We do not sell your data.
      </p>
      <h2>Retention and your rights</h2>
      <p>
        Records are kept for as long as needed for accounting and audit purposes. Consistent with the Personal Data
        Protection Act 2010, you may ask to access or correct your personal data by contacting us.
      </p>
    </DocPage>
  );
}
