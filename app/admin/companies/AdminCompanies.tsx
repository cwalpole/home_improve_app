"use client";

import { useActionState, useState, ChangeEvent } from "react";
import type { Company } from "@prisma/client";
import { upsertCompany, deleteCompany, type ActionState } from "./actions";
import styles from "./AdminCompanies.module.css";
import Image from "next/image";

type Props = { initialCompanies: Company[] };

const emptyForm: Partial<Company> = {
  id: undefined as unknown as number,
  name: "",
  tagline: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
  logoUrl: "",
};

export default function AdminCompanies({ initialCompanies }: Props) {
  const [editing, setEditing] = useState<Partial<Company> | null>(null);

  const [saveState, saveAction] = useActionState<ActionState, FormData>(
    upsertCompany,
    { ok: false }
  );
  const [delState, delAction] = useActionState<ActionState, FormData>(
    deleteCompany,
    { ok: false }
  );

  // ---- helpers --------------------------------------------------------------
  const startNew = () => setEditing({ ...emptyForm });
  const startEdit = (c: Company) => setEditing({ ...c });

  const onChange =
    (key: keyof Company) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setEditing((prev: any) => (prev ? { ...prev, [key]: value } : prev));
    };

  // ---- UI -------------------------------------------------------------------
  return (
    <div className={styles.wrap}>
      <section className={styles.sidebar}>
        <div className={styles.header}>
          <h1>Companies</h1>
          <button className={styles.primary} type="button" onClick={startNew}>
            + New
          </button>
        </div>

        <ul className={styles.list}>
          {initialCompanies.map((c) => (
            <li key={c.id} className={styles.item}>
              <button
                className={styles.row}
                type="button"
                onClick={() => startEdit(c)}
                title="Edit"
              >
                <div className={styles.avatar}>
                  {c.logoUrl ? <Image src={c.logoUrl} alt="" /> : c.name[0]}
                </div>
                <div className={styles.meta}>
                  <div className={styles.name}>{c.name}</div>
                  {c.city ? (
                    <div className={styles.sub}>
                      {c.city}
                      {c.region ? `, ${c.region}` : ""}
                    </div>
                  ) : null}
                </div>
              </button>

              <form action={delAction} className={styles.inlineForm}>
                <input type="hidden" name="id" value={c.id} />
                <button className={styles.danger} type="submit">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>

        {delState?.error && <p className={styles.error}>{delState.error}</p>}
        {delState?.ok && <p className={styles.ok}>Deleted ✓</p>}
      </section>

      <section className={styles.editor}>
        {editing ? (
          <form action={saveAction} className={styles.form}>
            {/* Hidden id only when updating */}
            {editing.id ? (
              <input type="hidden" name="id" value={editing.id} />
            ) : null}

            <label>
              <span>Name *</span>
              <input
                name="name"
                value={editing.name ?? ""}
                onChange={onChange("name")}
                required
              />
            </label>

            <label>
              <span>Tagline</span>
              <input
                name="tagline"
                value={editing.tagline ?? ""}
                onChange={onChange("tagline")}
              />
            </label>

            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={editing.email ?? ""}
                onChange={onChange("email")}
              />
            </label>

            <label>
              <span>Phone</span>
              <input
                name="phone"
                value={editing.phone ?? ""}
                onChange={onChange("phone")}
              />
            </label>

            <label>
              <span>Logo URL</span>
              <input
                name="logoUrl"
                value={editing.logoUrl ?? ""}
                onChange={onChange("logoUrl")}
              />
            </label>

            <div className={styles.grid2}>
              <label>
                <span>Address</span>
                <input
                  name="address"
                  value={editing.address ?? ""}
                  onChange={onChange("address")}
                />
              </label>
              <label>
                <span>City</span>
                <input
                  name="city"
                  value={editing.city ?? ""}
                  onChange={onChange("city")}
                />
              </label>
              <label>
                <span>Province/State</span>
                <input
                  name="region"
                  value={editing.region ?? ""}
                  onChange={onChange("region")}
                />
              </label>
              <label>
                <span>Postal Code</span>
                <input
                  name="postalCode"
                  value={editing.postalCode ?? ""}
                  onChange={onChange("postalCode")}
                />
              </label>
              <label>
                <span>Country</span>
                <input
                  name="country"
                  value={editing.country ?? ""}
                  onChange={onChange("country")}
                />
              </label>
            </div>

            <div className={styles.actions}>
              <button className={styles.primary} type="submit">
                {editing.id ? "Update" : "Create"}
              </button>
              <button
                className={styles.ghost}
                type="button"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              {!editing.id && (
                <button
                  className={styles.ghost}
                  type="button"
                  onClick={() => setEditing({ ...emptyForm })}
                >
                  Reset
                </button>
              )}
            </div>

            {saveState?.error && (
              <p className={styles.error}>{saveState.error}</p>
            )}
            {saveState?.ok && <p className={styles.ok}>Saved ✓</p>}
          </form>
        ) : (
          <div className={styles.placeholder}>
            Select a company or click “New”.
          </div>
        )}
      </section>
    </div>
  );
}
