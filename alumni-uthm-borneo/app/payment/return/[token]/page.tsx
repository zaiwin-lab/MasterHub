import { redirect } from 'next/navigation';

/** Links from the earlier ToyyibPay flow now open the payment page. */
export default async function LegacyReturn({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  redirect(`/pay/${encodeURIComponent(token)}`);
}
