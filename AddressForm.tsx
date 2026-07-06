"use client";

import { Address } from "@/types";

const COUNTRIES = ["India", "United States", "United Kingdom", "United Arab Emirates", "Germany", "France", "Canada", "Australia"];

export function AddressForm({
  address,
  onChange,
}: {
  address: Address;
  onChange: (address: Address) => void;
}) {
  function field(key: keyof Address, value: string) {
    onChange({ ...address, [key]: value });
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <input
        required
        placeholder="Full name"
        value={address.fullName}
        onChange={(e) => field("fullName", e.target.value)}
        className="border border-line px-3 py-3 text-sm bg-transparent sm:col-span-2"
      />
      <input
        required
        placeholder="Phone number"
        value={address.phone}
        onChange={(e) => field("phone", e.target.value)}
        className="border border-line px-3 py-3 text-sm bg-transparent sm:col-span-2"
      />
      <input
        required
        placeholder="Address line 1"
        value={address.line1}
        onChange={(e) => field("line1", e.target.value)}
        className="border border-line px-3 py-3 text-sm bg-transparent sm:col-span-2"
      />
      <input
        placeholder="Address line 2 (optional)"
        value={address.line2 ?? ""}
        onChange={(e) => field("line2", e.target.value)}
        className="border border-line px-3 py-3 text-sm bg-transparent sm:col-span-2"
      />
      <input
        required
        placeholder="City"
        value={address.city}
        onChange={(e) => field("city", e.target.value)}
        className="border border-line px-3 py-3 text-sm bg-transparent"
      />
      <input
        required
        placeholder="State / Region"
        value={address.state}
        onChange={(e) => field("state", e.target.value)}
        className="border border-line px-3 py-3 text-sm bg-transparent"
      />
      <input
        required
        placeholder="Postal code"
        value={address.postalCode}
        onChange={(e) => field("postalCode", e.target.value)}
        className="border border-line px-3 py-3 text-sm bg-transparent"
      />
      <select
        required
        value={address.country}
        onChange={(e) => field("country", e.target.value)}
        className="border border-line px-3 py-3 text-sm bg-transparent"
      >
        <option value="">Select country</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {address.country === "India" && (
        <input
          placeholder="GSTIN (optional, for business invoices)"
          value={address.gstNumber ?? ""}
          onChange={(e) => field("gstNumber", e.target.value)}
          className="border border-line px-3 py-3 text-sm bg-transparent sm:col-span-2"
        />
      )}
    </div>
  );
}
