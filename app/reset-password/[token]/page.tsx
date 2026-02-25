import styles from "../../login/login.module.css";

export const metadata = {
  title: "Set New Password",
};

export default async function ResetPasswordTokenPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const error = sp?.error;

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <h1 className={styles.title}>Set New Password</h1>
        {error ? <div className={styles.alert}>{error}</div> : null}
        <form method="post" action="/api/auth/reset" className={styles.form}>
          <input type="hidden" name="token" value={token} />
          <label>
            <span>New Password</span>
            <input name="password" type="password" required />
          </label>
          <label>
            <span>Confirm Password</span>
            <input name="confirm" type="password" required />
          </label>
          <button type="submit">Update Password</button>
        </form>
        <div className={styles.helpLinks}>
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
}
