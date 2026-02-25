import styles from "../login/login.module.css";

export const metadata = {
  title: "Reset Password",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const status = sp?.status;

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>
        {status === "sent" ? (
          <div className={styles.alert}>
            If an account exists, a reset link has been sent.
          </div>
        ) : null}
        {status === "missing" ? (
          <div className={styles.alert}>Email is required.</div>
        ) : null}
        <form method="post" action="/api/auth/reset-request" className={styles.form}>
          <label>
            <span>Email</span>
            <input name="email" type="email" required />
          </label>
          <button type="submit">Send Password Reset</button>
        </form>
        <div className={styles.helpLinks}>
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
}
