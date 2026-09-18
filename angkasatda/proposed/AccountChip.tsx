/**
 * AccountChip — persistent signed-in state in the global header.
 *
 * The live build ALREADY keeps participants logged in: the participant id is
 * stored in localStorage under `attendify:currentParticipantId` and restored on
 * boot, so the session survives closing the tab. It also already has a profile
 * page at /my and a "My Profile" label in all four languages.
 *
 * What it lacks is any visible signal. /my is linked exactly once in the whole
 * app (/check-in is linked 11 times), so participants never find it and assume
 * they were never logged in at all.
 *
 * This component reuses the existing participant context — it deliberately adds
 * no state of its own. Adjust the import to wherever useParticipant() lives.
 */
import { Link } from "react-router-dom";
import { useParticipant } from "../participant";

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase() || "?"
  );
}

export function AccountChip() {
  const { profile, setCurrentId } = useParticipant();

  // Signed out — invite them in.
  if (!profile) {
    return (
      <Link
        to="/login"
        className="rounded-full border border-white/30 px-4 py-1.5 text-[13px]
                   font-semibold text-white transition-colors hover:bg-white/10
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-gold-500"
      >
        Log masuk
      </Link>
    );
  }

  // Signed in — show who, and the way out.
  return (
    <details className="relative">
      <summary
        className="flex cursor-pointer list-none items-center gap-2 rounded-full
                   border border-white/20 bg-white/10 py-1 pl-1 pr-3
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-gold-500"
      >
        <span
          className="grid h-6 w-6 place-items-center rounded-full bg-gold-400
                     text-[11px] font-extrabold text-navy-900"
          aria-hidden="true"
        >
          {initials(profile.fullName)}
        </span>
        <span className="text-[13px] font-semibold text-white">
          {profile.fullName.split(" ")[0]}
        </span>
      </summary>

      <div
        className="absolute right-0 z-20 mt-2 w-52 rounded-xl border
                   border-navy-100 bg-white p-1.5 shadow-lg"
      >
        <Link to="/my" className="block rounded-lg px-3 py-2 text-sm hover:bg-navy-50">
          Profil Saya
        </Link>
        <Link to="/journey" className="block rounded-lg px-3 py-2 text-sm hover:bg-navy-50">
          Pelan Tindakan
        </Link>
        <button
          type="button"
          onClick={() => setCurrentId(null)} // clears the localStorage key
          className="block w-full rounded-lg px-3 py-2 text-left text-sm
                     text-navy-500 hover:bg-navy-50"
        >
          Log keluar
        </button>
      </div>
    </details>
  );
}
